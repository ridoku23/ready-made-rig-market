import { createServerFn } from "@tanstack/react-start";

type CheckoutItem = { id: string; name: string; price: number; qty: number };
type Customer = { name: string; phone: string; email: string };

async function sha256Hex(text: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const createWompiCheckout = createServerFn({ method: "POST" })
  .inputValidator((input: { items: CheckoutItem[]; customer: Customer }) => input)
  .handler(async ({ data }) => {
    const publicKey = process.env["WOMPI_PUBLIC_KEY"];
    const integrity = process.env["WOMPI_INTEGRITY_SECRET"];
    if (!publicKey || !integrity) throw new Error("Wompi aún no está configurado. Escríbenos por WhatsApp para completar tu compra.");
    if (!data.items.length) throw new Error("El carrito está vacío");

    // Re-read prices from the database so the charged total cannot be tampered with.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const ids = data.items.map((i) => i.id);
    const { data: rows, error } = await supabaseAdmin.from("products").select("id, name, price, stock, active").in("id", ids);
    if (error) throw error;

    const items = data.items.map((i) => {
      const p = rows?.find((r) => r.id === i.id);
      if (!p || !p.active) throw new Error(`"${i.name}" ya no está disponible`);
      if (p.stock < i.qty) throw new Error(`Solo quedan ${p.stock} unidades de "${p.name}"`);
      return { id: p.id, name: p.name, price: p.price, qty: i.qty };
    });

    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    const amountInCents = total * 100;
    const reference = `NEXUS-${Date.now()}`;

    const { error: insErr } = await supabaseAdmin.from("orders").insert({
      reference,
      customer_name: data.customer.name,
      customer_phone: data.customer.phone,
      items,
      total,
      status: "pending",
    });
    if (insErr) throw insErr;

    const signature = await sha256Hex(`${reference}${amountInCents}COP${integrity}`);
    return { reference, amountInCents, signature, publicKey };
  });
