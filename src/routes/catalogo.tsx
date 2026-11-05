import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PRODUCTS, cop, useCart } from "@/lib/shop";

export const Route = createFileRoute("/catalogo")({
  head: () => ({
    meta: [
      { title: "Catálogo · PC, componentes y accesorios · NEXUS" },
      { name: "description", content: "Compra PC ensamblados, componentes y accesorios con envío a todo Colombia." },
      { property: "og:title", content: "Catálogo NEXUS Tecnología" },
      { property: "og:description", content: "PC ensamblados, componentes y accesorios." },
    ],
  }),
  component: Catalogo,
});

const CATS = ["Todos", "PC ensamblados", "Componentes", "Accesorios"];

function Catalogo() {
  const [cat, setCat] = useState("Todos");
  const [q, setQ] = useState("");
  const { add } = useCart();
  const list = PRODUCTS.filter((p) => (cat === "Todos" || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Catálogo y <span className="text-gradient">ventas</span></h1>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar productos..." className="mt-6 w-full rounded-full border bg-input/20 px-5 py-3 outline-none focus:ring-2 focus:ring-ring" />
      <div className="mt-4 flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-4 py-1.5 text-sm ${cat === c ? "btn-brand" : "hover:bg-secondary"}`}>{c}</button>
        ))}
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <div key={p.id} className="glow-card overflow-hidden">
            <img src={p.image} alt={p.name} loading="lazy" width={816} height={816} className="aspect-square w-full object-cover" />
            <div className="p-5">
              <p className="text-xs uppercase tracking-wider text-accent">{p.category}</p>
              <h2 className="mt-1 text-base font-bold">{p.name}</h2>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold">{cop(p.price)}</span>
                <button onClick={() => { add(p.id); toast.success(`${p.name} agregado al carrito`); }} className="btn-brand rounded-full px-4 py-2 text-sm font-semibold">Agregar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
