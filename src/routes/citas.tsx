import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SERVICES } from "./servicios";
import { waLink } from "@/lib/shop";

export const Route = createFileRoute("/citas")({
  head: () => ({
    meta: [
      { title: "Agendar cita o ensamble · NEXUS Tecnología" },
      { name: "description", content: "Agenda mantenimiento, reparación o el ensamble de tu PC a medida." },
      { property: "og:title", content: "Agenda tu cita · NEXUS" },
      { property: "og:description", content: "Reserva servicio técnico o ensamble de computador." },
    ],
  }),
  component: Citas,
});

const field = "mt-1 w-full rounded-lg border bg-input/20 px-3 py-2 outline-none focus:ring-2 focus:ring-ring";

function Citas() {
  const [service, setService] = useState(SERVICES[0]!.title);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) || "");
    const msg = `Hola NEXUS, quiero agendar una cita.
Servicio: ${g("service")}
Nombre: ${g("name")}
Teléfono: ${g("phone")}
Fecha preferida: ${g("date")} ${g("time")}
Modalidad: ${g("mode")}
Equipo: ${g("device")}
${g("service").includes("Ensamblaje") ? `Uso y presupuesto: ${g("budget")}\n` : ""}Detalle: ${g("notes")}`;
    window.open(waLink(msg), "_blank");
  };
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold">Agenda tu <span className="text-gradient">cita</span></h1>
      <p className="mt-2 text-muted-foreground">Completa el formulario y te confirmamos por WhatsApp.</p>
      <form onSubmit={onSubmit} className="glow-card mt-8 grid gap-4 p-6 sm:grid-cols-2">
        <label className="sm:col-span-2 text-sm">Servicio
          <select name="service" value={service} onChange={(e) => setService(e.target.value)} className={field}>
            {SERVICES.filter((s) => !s.title.includes("Venta")).map((s) => <option key={s.title} className="bg-card">{s.title}</option>)}
          </select>
        </label>
        <label className="text-sm">Nombre completo<input required name="name" className={field} /></label>
        <label className="text-sm">Teléfono<input required name="phone" type="tel" className={field} /></label>
        <label className="text-sm">Fecha<input required name="date" type="date" className={field} /></label>
        <label className="text-sm">Hora<input required name="time" type="time" className={field} /></label>
        <label className="text-sm">Modalidad
          <select name="mode" className={field}><option className="bg-card">En el local</option><option className="bg-card">A domicilio</option><option className="bg-card">Remoto</option></select>
        </label>
        <label className="text-sm">Equipo (marca / tipo)<input name="device" className={field} placeholder="Ej: Portátil Lenovo" /></label>
        {service.includes("Ensamblaje") && (
          <label className="sm:col-span-2 text-sm">Uso y presupuesto<input required name="budget" className={field} placeholder="Ej: Gaming, $4.000.000" /></label>
        )}
        <label className="sm:col-span-2 text-sm">Describe lo que necesitas<textarea name="notes" rows={3} className={field} /></label>
        <button className="btn-brand sm:col-span-2 rounded-full py-3 font-semibold">Enviar solicitud por WhatsApp</button>
      </form>
    </div>
  );
}
