import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceso administrador · NEXUS Tecnología" },
      { name: "description", content: "Ingreso al panel de administración de NEXUS Tecnología." },
    ],
  }),
  component: AuthPage,
});

const field = "mt-1 w-full rounded-lg border bg-input/20 px-3 py-2 outline-none focus:ring-2 focus:ring-ring";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") || "");
    const password = String(f.get("password") || "");
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión.");
          setMode("login");
        } else {
          navigate({ to: "/admin" });
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo completar la operación");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold">Acceso <span className="text-gradient">administrador</span></h1>
      <p className="mt-2 text-sm text-muted-foreground">Desde aquí gestionas productos, precios, fotos y stock.</p>
      <form onSubmit={onSubmit} className="glow-card mt-8 grid gap-4 p-6">
        <label className="text-sm">Correo electrónico<input required name="email" type="email" className={field} /></label>
        <label className="text-sm">Contraseña<input required name="password" type="password" minLength={6} className={field} /></label>
        <button disabled={busy} className="btn-brand rounded-full py-3 font-semibold disabled:opacity-60">
          {busy ? "Un momento..." : mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </button>
        <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-sm text-accent">
          {mode === "login" ? "¿Primera vez? Crea tu cuenta de administrador" : "Ya tengo cuenta, iniciar sesión"}
        </button>
      </form>
    </div>
  );
}
