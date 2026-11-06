import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, LogOut, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cop } from "@/lib/shop";
import { fallbackImage } from "@/lib/products";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Panel de administración · NEXUS Tecnología" },
      { name: "description", content: "Gestión de inventario, precios, fotos y pedidos de NEXUS." },
    ],
  }),
  component: Admin,
});

type Row = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image_url: string | null;
  active: boolean;
};

type Order = {
  id: string;
  reference: string;
  customer_name: string;
  customer_phone: string;
  total: number;
  status: string;
  created_at: string;
};

const CATS = ["PC ensamblados", "Componentes", "Accesorios"];
const field = "mt-1 w-full rounded-lg border bg-input/20 px-3 py-2 outline-none focus:ring-2 focus:ring-ring";

type Draft = { id: string | null; name: string; category: string; description: string; price: number; stock: number; image_url: string | null; active: boolean };
const emptyDraft: Draft = { id: null, name: "", category: "Componentes", description: "", price: 0, stock: 0, image_url: null, active: true };

function Admin() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return setIsAdmin(false);
      const { data: ok, error } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
      setIsAdmin(!error && !!ok);
    })();
  }, []);

  const products = useQuery({
    queryKey: ["admin-products"],
    enabled: isAdmin === true,
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const orders = useQuery({
    queryKey: ["admin-orders"],
    enabled: isAdmin === true,
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("id, reference, customer_name, customer_phone, total, status, created_at").order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      return (data ?? []) as Order[];
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  const onPickFile = (e: ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] ?? null);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setBusy(true);
    try {
      let image_url = draft.image_url;
      if (file) {
        const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const { error: upErr } = await supabase.storage.from("product-images").upload(path, file);
        if (upErr) throw upErr;
        const { data: signed, error: signErr } = await supabase.storage.from("product-images").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
        if (signErr) throw signErr;
        image_url = signed.signedUrl;
      }
      const row = { name: draft.name, category: draft.category, description: draft.description, price: draft.price, stock: draft.stock, image_url, active: draft.active };
      const { error } = draft.id
        ? await supabase.from("products").update(row).eq("id", draft.id)
        : await supabase.from("products").insert(row);
      if (error) throw error;
      toast.success(draft.id ? "Producto actualizado" : "Producto creado");
      setDraft(null);
      setFile(null);
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (r: Row) => {
    if (!window.confirm(`¿Eliminar "${r.name}"?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success("Producto eliminado");
    refresh();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (isAdmin === null) return <div className="mx-auto max-w-4xl px-4 py-24 text-center text-muted-foreground">Cargando...</div>;
  if (isAdmin === false)
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Sin permisos de administrador</h1>
        <p className="mt-2 text-sm text-muted-foreground">Esta cuenta no tiene acceso al panel. Contáctanos si crees que es un error.</p>
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Panel de <span className="text-gradient">administración</span></h1>
        <div className="flex gap-2">
          <button onClick={() => { setDraft(emptyDraft); setFile(null); }} className="btn-brand flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"><Plus className="h-4 w-4" /> Nuevo producto</button>
          <button onClick={signOut} className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm"><LogOut className="h-4 w-4" /> Salir</button>
        </div>
      </div>

      {draft && (
        <form onSubmit={save} className="glow-card mt-6 grid gap-4 p-6 sm:grid-cols-2">
          <div className="flex items-center justify-between sm:col-span-2">
            <h2 className="font-bold">{draft.id ? "Editar producto" : "Nuevo producto"}</h2>
            <button type="button" onClick={() => setDraft(null)} aria-label="Cerrar"><X className="h-5 w-5" /></button>
          </div>
          <label className="text-sm">Nombre<input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={field} /></label>
          <label className="text-sm">Categoría
            <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className={field}>
              {CATS.map((c) => <option key={c} className="bg-card">{c}</option>)}
            </select>
          </label>
          <label className="text-sm">Precio (COP)<input required type="number" min={0} value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} className={field} /></label>
          <label className="text-sm">Stock disponible<input required type="number" min={0} value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })} className={field} /></label>
          <label className="sm:col-span-2 text-sm">Descripción<textarea rows={2} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={field} /></label>
          <label className="sm:col-span-2 text-sm">Foto del producto<input type="file" accept="image/*" onChange={onPickFile} className={field} /></label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} /> Visible en la tienda
          </label>
          <button disabled={busy} className="btn-brand rounded-full py-3 font-semibold disabled:opacity-60 sm:col-span-2">{busy ? "Guardando..." : "Guardar producto"}</button>
        </form>
      )}

      <h2 className="mt-10 text-xl font-bold">Inventario</h2>
      <div className="glow-card mt-4 divide-y">
        {(products.data ?? []).map((r) => (
          <div key={r.id} className="flex flex-wrap items-center gap-3 p-4">
            <img src={r.image_url || fallbackImage(r.category)} alt={r.name} className="h-14 w-14 rounded object-cover" width={56} height={56} />
            <div className="min-w-40 flex-1">
              <p className="font-semibold">{r.name} {!r.active && <span className="text-xs text-muted-foreground">(oculto)</span>}</p>
              <p className="text-sm text-muted-foreground">{r.category} · {cop(r.price)} · Stock: {r.stock}</p>
            </div>
            <button onClick={() => { setDraft({ id: r.id, name: r.name, category: r.category, description: r.description, price: r.price, stock: r.stock, image_url: r.image_url, active: r.active }); setFile(null); }} aria-label="Editar" className="rounded border p-2"><Pencil className="h-4 w-4" /></button>
            <button onClick={() => remove(r)} aria-label="Eliminar" className="rounded border p-2 text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        {products.data?.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">Aún no hay productos. Crea el primero con “Nuevo producto”.</p>}
      </div>

      <h2 className="mt-10 text-xl font-bold">Pedidos recientes</h2>
      <div className="glow-card mt-4 divide-y">
        {(orders.data ?? []).map((o) => (
          <div key={o.id} className="flex flex-wrap items-center gap-3 p-4 text-sm">
            <span className="font-mono text-xs">{o.reference}</span>
            <span className="flex-1">{o.customer_name} · {o.customer_phone}</span>
            <span className="font-semibold">{cop(o.total)}</span>
            <span className={`rounded-full border px-3 py-1 text-xs ${o.status === "approved" ? "btn-brand" : ""}`}>{o.status}</span>
          </div>
        ))}
        {orders.data?.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">Aún no hay pedidos en línea.</p>}
      </div>
    </div>
  );
}
