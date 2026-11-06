import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { cop, useCart, waLink } from "@/lib/shop";
import { createWompiCheckout } from "@/lib/wompi.functions";

export const Route = createFileRoute("/carrito")({
  head: () => ({
    meta: [
      { title: "Carrito y pago · NEXUS Tecnología" },
      { name: "description", content: "Finaliza tu compra: pago en tienda o virtual y envío a todo Colombia." },
      { property: "og:title", content: "Carrito · NEXUS" },
      { property: "og:description", content: "Finaliza tu compra en NEXUS Tecnología." },
    ],
  }),
  component: Carrito,
});

const field = "mt-1 w-full rounded-lg border bg-input/20 px-3 py-2 outline-none focus:ring-2 focus:ring-ring";
const PAY = {
  sitio: ["Efectivo", "Transferencia"],
  virtual: ["Transferencia", "Tarjeta (Wompi)"],
} as const;

declare global {
  interface Window { WidgetCheckout?: new (config: Record<string, unknown>) => { open: (cb?: (r: unknown) => void) => void } }
}

async function loadWompiWidget() {
  if (window.WidgetCheckout) return;
  await new Promise<void>((res, rej) => {
    const s = document.createElement("script");
    s.src = "https://checkout.wompi.co/widget.js";
    s.onload = () => res();
    s.onerror = () => rej(new Error("No se pudo cargar la pasarela de pago"));
    document.head.appendChild(s);
  });
}

function Carrito() {
  const { items, setQty, total, clear } = useCart();
  const [mode, setMode] = useState<"sitio" | "virtual">("virtual");
  const [pay, setPay] = useState<string>(PAY.virtual[0]);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) || "");

    if (mode === "virtual" && pay === "Tarjeta (Wompi)") {
      setBusy(true);
      try {
        const res = await createWompiCheckout({
          data: {
            items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
            customer: { name: g("name"), phone: g("phone"), email: g("email") },
          },
        });
        await loadWompiWidget();
        const checkout = new window.WidgetCheckout!({
          currency: "COP",
          amountInCents: res.amountInCents,
          reference: res.reference,
          publicKey: res.publicKey,
          signature: { integrity: res.signature },
          redirectUrl: `${window.location.origin}/carrito`,
        });
        checkout.open();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "No se pudo iniciar el pago");
      } finally {
        setBusy(false);
      }
      return;
    }

    const lines = items.map((i) => `• ${i.qty} x ${i.name} (${cop(i.price * i.qty)})`).join("\n");
    const ship = mode === "virtual"
      ? `Envío a: ${g("address")}, ${g("city")}, ${g("dept")}\nIndicaciones: ${g("ref")}`
      : "Recoge en tienda";
    const msg = `Hola NEXUS, quiero hacer este pedido:\n${lines}\nTotal: ${cop(total)}\n\nCompra: ${mode === "sitio" ? "En tienda" : "Virtual con envío nacional"}\nPago: ${pay}\n\nNombre: ${g("name")}\nCédula/NIT: ${g("doc")}\nTeléfono: ${g("phone")}\nCorreo: ${g("email")}\n${ship}`;
    window.open(waLink(msg), "_blank");
    clear();
  };

  if (!items.length)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
        <Link to="/catalogo" className="btn-brand mt-6 inline-block rounded-full px-6 py-3 font-semibold">Ver catálogo</Link>
      </div>
    );

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <h1 className="text-3xl font-bold">Tu <span className="text-gradient">pedido</span></h1>
        <div className="glow-card mt-6 divide-y">
          {items.map((i) => (
            <div key={i.id} className="flex items-center gap-3 p-4">
              <img src={i.image} alt={i.name} className="h-14 w-14 rounded object-cover" width={56} height={56} />
              <div className="flex-1"><p className="font-semibold">{i.name}</p><p className="text-sm text-muted-foreground">{cop(i.price)}</p></div>
              <button aria-label="Quitar uno" onClick={() => setQty(i.id, i.qty - 1)} className="rounded border p-1"><Minus className="h-4 w-4" /></button>
              <span className="w-6 text-center">{i.qty}</span>
              <button aria-label="Agregar uno" onClick={() => setQty(i.id, i.qty + 1)} className="rounded border p-1"><Plus className="h-4 w-4" /></button>
            </div>
          ))}
          <div className="flex justify-between p-4 text-lg font-bold"><span>Total</span><span>{cop(total)}</span></div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="glow-card grid gap-4 p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <p className="text-sm font-semibold">¿Cómo compras?</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["virtual", "sitio"] as const).map((m) => (
              <button type="button" key={m} onClick={() => { setMode(m); setPay(PAY[m][0]); }} className={`rounded-lg border px-3 py-2 text-sm ${mode === m ? "btn-brand" : ""}`}>
                {m === "virtual" ? "Virtual (envío nacional)" : "En tienda"}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <p className="text-sm font-semibold">Método de pago</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {PAY[mode].map((p) => (
              <button type="button" key={p} onClick={() => setPay(p)} className={`rounded-lg border px-3 py-2 text-sm ${pay === p ? "btn-brand" : ""}`}>{p}</button>
            ))}
          </div>
        </div>
        <label className="text-sm">Nombre completo<input required name="name" className={field} /></label>
        <label className="text-sm">Cédula / NIT<input required name="doc" className={field} /></label>
        <label className="text-sm">Teléfono<input required name="phone" type="tel" className={field} /></label>
        <label className="text-sm">Correo<input required name="email" type="email" className={field} /></label>
        {mode === "virtual" && (
          <>
            <label className="sm:col-span-2 text-sm">Dirección de envío<input required name="address" className={field} /></label>
            <label className="text-sm">Ciudad / municipio<input required name="city" className={field} /></label>
            <label className="text-sm">Departamento<input required name="dept" className={field} /></label>
            <label className="sm:col-span-2 text-sm">Barrio / indicaciones<input name="ref" className={field} /></label>
          </>
        )}
        <p className="sm:col-span-2 text-xs text-muted-foreground">
          {pay === "Tarjeta (Wompi)"
            ? "Al confirmar se abrirá la ventana segura de Wompi para pagar con tarjeta, PSE o Nequi."
            : "Te enviaremos por WhatsApp los datos de transferencia para confirmar tu pedido."}
        </p>
        <button disabled={busy} className="btn-brand sm:col-span-2 rounded-full py-3 font-semibold disabled:opacity-60">
          {busy ? "Preparando pago..." : pay === "Tarjeta (Wompi)" ? "Pagar con Wompi" : "Confirmar pedido por WhatsApp"}
        </button>
      </form>
    </div>
  );
}
