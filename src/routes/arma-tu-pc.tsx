import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BUILDER, ASSEMBLY_FEE, cop, waLink } from "@/lib/shop";

export const Route = createFileRoute("/arma-tu-pc")({
  head: () => ({
    meta: [
      { title: "Arma tu PC a medida · NEXUS Tecnología" },
      { name: "description", content: "Elige procesador, RAM, gráfica y más. Te lo ensamblamos y enviamos a todo Colombia." },
      { property: "og:title", content: "Arma tu PC · NEXUS" },
      { property: "og:description", content: "Personaliza tu computador pieza por pieza." },
    ],
  }),
  component: Builder,
});

function Builder() {
  const [sel, setSel] = useState<number[]>(BUILDER.map(() => 0));
  const parts = BUILDER.map((b, i) => b.options[sel[i] ?? 0]!);
  const total = parts.reduce((s, p) => s + p.price, 0) + ASSEMBLY_FEE;
  const msg = `Hola NEXUS, quiero cotizar este PC a medida:\n${BUILDER.map((b, i) => `• ${b.step}: ${parts[i]!.name}`).join("\n")}\nTotal estimado (con ensamble): ${cop(total)}`;
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <h1 className="text-3xl font-bold">Arma tu <span className="text-gradient">PC</span></h1>
        <p className="mt-2 text-muted-foreground">Elige cada componente. Validamos compatibilidad antes de ensamblar.</p>
        <div className="mt-8 space-y-6">
          {BUILDER.map((b, i) => (
            <div key={b.step}>
              <p className="font-display text-sm text-accent">{i + 1}. {b.step}</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {b.options.map((o, j) => (
                  <button key={o.name} onClick={() => setSel(sel.map((v, k) => (k === i ? j : v)))}
                    className={`rounded-lg border p-3 text-left text-sm ${sel[i] === j ? "btn-brand" : "hover:bg-secondary"}`}>
                    <span className="block font-semibold">{o.name}</span>
                    <span className="opacity-80">{o.price ? cop(o.price) : "Incluido"}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <aside className="glow-card h-fit p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-bold">Tu configuración</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {parts.map((p, i) => <li key={i} className="flex justify-between gap-2"><span className="text-muted-foreground">{p.name}</span><span>{cop(p.price)}</span></li>)}
          <li className="flex justify-between"><span className="text-muted-foreground">Ensamble y pruebas</span><span>{cop(ASSEMBLY_FEE)}</span></li>
        </ul>
        <div className="mt-4 flex justify-between border-t pt-4 text-xl font-bold"><span>Total</span><span>{cop(total)}</span></div>
        <a href={waLink(msg)} target="_blank" rel="noreferrer" className="btn-brand mt-6 block rounded-full py-3 text-center font-semibold">Cotizar por WhatsApp</a>
        <p className="mt-3 text-xs text-muted-foreground">Precios de referencia; confirmamos disponibilidad al cotizar.</p>
      </aside>
    </div>
  );
}
