import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Minus, Plus } from "lucide-react";
import { cop, useCart, waLink } from "@/lib/shop";

export const Route = createFileRoute("/carrito")({
  head: () => ({
    meta: [
      { title: "Carrito y pedido · NEXUS Tecnología" },
      { name: "description", content: "Arma tu pedido y envíalo por WhatsApp: recogida en tienda o envío a todo Colombia." },
      { property: "og:title", content: "Carrito · NEXUS" },
      { property: "og:description", content: "Haz tu pedido en NEXUS Tecnología." },
    ],
  }),
  component: Carrito,
});

const field = "mt-1 w-full rounded-lg border bg-input/20 px-3 py-2 outline-none focus:ring-2 focus:ring-ring";
const PAY = {
  sitio: ["Efectivo", "Transferencia"],
  virtual: ["Transferencia", "Tarjeta / PSE (link de pago)"],
} as const;

function Carrito() {
  const { items, setQty, total, clear } = useCart();
  const [mode, setMode] = useState<"sitio" | "virtual">("virtual");
  const [pay, setPay] = useState<string>(PAY.virtual[0]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) || "");

    const lines = items.map((i) => `• ${i.qty} x ${i.name} (${cop(i.price * i.qty)})`).join("\n");
    const ship = mode === "virtual"
      ? `Envío a: ${g("address")}, ${g("city")}, ${g("dept")}\nIndicaciones: ${g("ref")}`
      : "Recoge en tienda";
    const msg = `Hola NEXUS, quiero hacer este pedido:\n${lines}\nTotal productos: ${cop(total)}\n\nCompra: ${mode === "sitio" ? "En tienda" : "Virtual con envío nacional"}\nPago: ${pay}\n\nNombre: ${g("name")}\nCédula/NIT: ${g("doc")}\nTeléfono: ${g("phone")}\nCorreo: ${g("email")}\n${ship}`;
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
          <div className="flex justify-between p-4 text-lg font-bold"><span>Total productos</span><span>{cop(total)}</span></div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">El costo del envío no está incluido: te lo confirmamos por WhatsApp.</p>
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
          {pay.startsWith("Tarjeta")
            ? "Te escribiremos por WhatsApp con el costo del envío y el link de pago para tarjeta o PSE."
            : "Te escribiremos por WhatsApp con el costo del envío y los datos para confirmar tu pedido."}
        </p>
        <button className="btn-brand sm:col-span-2 rounded-full py-3 font-semibold">Enviar pedido por WhatsApp</button>
      </form>
    </div>
  );
}
