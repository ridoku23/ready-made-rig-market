import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Truck, CreditCard } from "lucide-react";
import setup from "@/assets/nexus-setup.jpg";
import { SERVICES } from "./servicios";
import { PRODUCTS, cop } from "@/lib/shop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEXUS Tecnología · Computadores, reparación y ensamble" },
      { name: "description", content: "Mantenimiento, reparación, ensamblaje de PC y venta de partes con envíos a todo Colombia." },
      { property: "og:title", content: "NEXUS Tecnología · Computadores" },
      { property: "og:description", content: "Tecnología e innovación en tus manos. Servicio técnico y tienda de PC." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="grid items-center gap-10 py-14 md:grid-cols-2">
        <div>
          <p className="font-display text-sm tracking-[0.3em] text-accent">¡HOLA! SOMOS NEXUS</p>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
            Tecnología e innovación <span className="text-gradient">en tus manos.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">Servicio confiable y atención cercana: reparamos, ensamblamos y vendemos computadores y componentes.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/catalogo" className="btn-brand rounded-full px-6 py-3 font-semibold">Ver catálogo</Link>
            <Link to="/arma-tu-pc" className="rounded-full border px-6 py-3 font-semibold hover:bg-secondary">Arma tu PC</Link>
            <Link to="/citas" className="rounded-full border px-6 py-3 font-semibold hover:bg-secondary">Agendar cita</Link>
          </div>
        </div>
        <img src={setup} alt="PC gamer NEXUS con periféricos RGB" className="glow-card w-full" width={780} height={510} />
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[[ShieldCheck, "Servicio confiable", "Garantía y atención cercana"], [Truck, "Envíos nacionales", "A todo Colombia"], [CreditCard, "Todos los pagos", "Efectivo, transferencia y Wompi"]].map(([I, t, d]) => {
          const Icon = I as typeof ShieldCheck;
          return (
            <div key={t as string} className="glow-card flex items-center gap-4 p-5">
              <Icon className="h-8 w-8 text-accent" />
              <div><p className="font-semibold">{t as string}</p><p className="text-sm text-muted-foreground">{d as string}</p></div>
            </div>
          );
        })}
      </section>

      <section className="mt-16">
        <div className="flex items-end justify-between"><h2 className="text-2xl font-bold">Productos destacados</h2><Link to="/catalogo" className="text-sm text-accent">Ver todo →</Link></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.slice(0, 4).map((p) => (
            <Link key={p.id} to="/catalogo" className="glow-card overflow-hidden transition hover:-translate-y-1">
              <img src={p.image} alt={p.name} loading="lazy" width={816} height={816} className="aspect-square w-full object-cover" />
              <div className="p-4"><p className="font-semibold">{p.name}</p><p className="text-accent">{cop(p.price)}</p></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Ofrecemos</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <Link key={s.title} to={s.title.includes("Venta") ? "/catalogo" : "/citas"} className="glow-card p-5 transition hover:-translate-y-1">
              <s.icon className="h-7 w-7 text-accent" />
              <p className="mt-3 font-semibold">{s.title}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
