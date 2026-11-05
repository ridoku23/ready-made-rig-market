import { createFileRoute, Link } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { MessageCircle, CalendarCheck, Truck } from "lucide-react";
import { waLink } from "@/lib/shop";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto · NEXUS Tecnología" },
      { name: "description", content: "Escríbenos por WhatsApp al 301 600 0986 para dudas, cotizaciones y soporte." },
      { property: "og:title", content: "Contacto · NEXUS" },
      { property: "og:description", content: "Resolvemos tus dudas de ensamble, compras y soporte." },
    ],
  }),
  component: Contacto,
});

const field = "mt-1 w-full rounded-lg border bg-input/20 px-3 py-2 outline-none focus:ring-2 focus:ring-ring";

function Contacto() {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    window.open(waLink(`Hola NEXUS, soy ${f.get("name")} (${f.get("phone")}).\nTema: ${f.get("topic")}\n${f.get("msg")}`), "_blank");
  };
  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 md:grid-cols-2">
      <div>
        <h1 className="text-3xl font-bold"><span className="text-gradient">Contáctanos</span></h1>
        <p className="mt-3 text-muted-foreground">Servicio confiable y atención cercana.</p>
        <div className="mt-8 space-y-4">
          <a href={waLink("Hola NEXUS")} target="_blank" rel="noreferrer" className="glow-card flex items-center gap-4 p-4"><MessageCircle className="h-7 w-7 text-whatsapp" /><div><p className="font-semibold">WhatsApp</p><p className="text-sm text-muted-foreground">301 600 0986</p></div></a>
          <Link to="/citas" className="glow-card flex items-center gap-4 p-4"><CalendarCheck className="h-7 w-7 text-accent" /><div><p className="font-semibold">Agenda mantenimiento</p><p className="text-sm text-muted-foreground">Preventivo, correctivo y reparación</p></div></Link>
          <div className="glow-card flex items-center gap-4 p-4"><Truck className="h-7 w-7 text-accent" /><div><p className="font-semibold">Envíos nacionales</p><p className="text-sm text-muted-foreground">A todo Colombia</p></div></div>
        </div>
      </div>
      <form onSubmit={onSubmit} className="glow-card grid gap-4 p-6">
        <label className="text-sm">Nombre<input required name="name" className={field} /></label>
        <label className="text-sm">Teléfono<input required name="phone" type="tel" className={field} /></label>
        <label className="text-sm">Tema
          <select name="topic" className={field}>
            {["Duda de ensamble", "Cotizar PC a medida", "Compra de componentes", "Soporte técnico", "Otro"].map((t) => <option key={t} className="bg-card">{t}</option>)}
          </select>
        </label>
        <label className="text-sm">Mensaje<textarea required name="msg" rows={4} className={field} /></label>
        <button className="btn-brand rounded-full py-3 font-semibold">Enviar por WhatsApp</button>
      </form>
    </div>
  );
}
