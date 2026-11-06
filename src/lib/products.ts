import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import pc from "@/assets/p-pc-gamer.jpg";
import peri from "@/assets/p-perifericos.jpg";
import comp from "@/assets/p-componentes.jpg";

export type StoreProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  desc: string;
  image: string;
  stock: number;
};

const FALLBACK: Record<string, string> = {
  "PC ensamblados": pc,
  Componentes: comp,
  Accesorios: peri,
};
export const fallbackImage = (category: string) => FALLBACK[category] ?? comp;

export async function fetchProducts(): Promise<StoreProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    price: r.price,
    desc: r.description,
    image: r.image_url || fallbackImage(r.category),
    stock: r.stock,
  }));
}

export const productsQuery = { queryKey: ["products"], queryFn: fetchProducts } as const;

export function useProducts() {
  return useQuery(productsQuery);
}
