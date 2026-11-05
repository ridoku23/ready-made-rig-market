import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings, Wrench, Laptop, Monitor, ShoppingCart, Headset } from "lucide-react";

export const SERVICES = [
  { icon: Settings, title: "Mantenimiento preventivo", desc: "Limpieza interna, cambio de pasta térmica y optimización del sistema." },
  { icon: Wrench, title: "Mantenimiento correctivo", desc: "Diagnóstico y solución de fallas de hardware y software." },
  { icon: Laptop, title: "Reparación de equipos", desc: "Portátiles y computadores de escritorio de todas las marcas." },
  { icon: Monitor, title: "Ensamblaje de computadores", desc: "Armamos tu PC a medida: gamer, diseño u oficina." },
  { icon: ShoppingCart, title: "Venta de partes y accesorios", desc: "Componentes, periféricos y PC listos para usar." },
  { icon: Headset, title: "Soporte técnico", desc: "Asesoría presencial y remota cuando la necesites." },
];

export const Route = createFileRoute("/servicios")({
  head: () => ({
    meta: [
      { title: "Servicios técnicos · NEXUS Tecnología" },
      { name: "description", content: "Mantenimiento preventivo y correctivo, reparación, ensamblaje de PC y soporte técnico." },
      { property: "og:title", content: "Servicios técnicos · NEXUS" },
      { property: "og:description", content: "Reparación, mantenimiento y ensamble de computadores." },
    ],
  }),
  component: Servicios,
});

function Servicios() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Nuestros <span className="text-gradient">servicios</span></h1>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <div key={s.title} className="glow-card flex flex-col p-6">
            <s.icon className="h-8 w-8 text-accent" />
            <h2 className="mt-4 text-base font-bold">{s.title}</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.desc}</p>
            <Link to={s.title.includes("Venta") ? "/catalogo" : "/citas"} className="mt-5 text-sm font-semibold text-accent">
              {s.title.includes("Venta") ? "Ir a la tienda →" : "Agendar cita →"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
