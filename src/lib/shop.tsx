import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import pc from "@/assets/p-pc-gamer.jpg";
import gpu from "@/assets/p-gpu.jpg";
import peri from "@/assets/p-perifericos.jpg";
import comp from "@/assets/p-componentes.jpg";

export const WHATSAPP = "573016000986";
export const waLink = (text: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

export type Product = { id: string; name: string; category: string; price: number; image: string; desc: string };

export const PRODUCTS: Product[] = [
  { id: "pc-gamer-pro", name: "PC Gamer Pro", category: "PC ensamblados", price: 5200000, image: pc, desc: "Ryzen 7, RTX, 32GB RAM, SSD 1TB" },
  { id: "pc-oficina", name: "PC Oficina", category: "PC ensamblados", price: 1900000, image: pc, desc: "Intel Core i5, 16GB RAM, SSD 512GB" },
  { id: "gpu-rtx", name: "Tarjeta gráfica RTX", category: "Componentes", price: 2400000, image: gpu, desc: "Triple ventilador, 12GB" },
  { id: "kit-ram-ssd", name: "Kit RAM DDR5 + SSD NVMe", category: "Componentes", price: 890000, image: comp, desc: "32GB DDR5 + SSD 1TB" },
  { id: "combo-rgb", name: "Combo teclado + mouse RGB", category: "Accesorios", price: 280000, image: peri, desc: "Teclado mecánico y mouse gamer" },
];

export const cop = (n: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

type Item = { id: string; qty: number };
type Ctx = { items: Item[]; add: (id: string) => void; setQty: (id: string, q: number) => void; clear: () => void; count: number; total: number };
const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem("nexus-cart") || "[]")); } catch { /* ignore */ }
  }, []);
  const save = (next: Item[]) => { setItems(next); localStorage.setItem("nexus-cart", JSON.stringify(next)); };
  const add = (id: string) => {
    const f = items.find((i) => i.id === id);
    save(f ? items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)) : [...items, { id, qty: 1 }]);
  };
  const setQty = (id: string, q: number) => save(q <= 0 ? items.filter((i) => i.id !== id) : items.map((i) => (i.id === id ? { ...i, qty: q } : i)));
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * (PRODUCTS.find((p) => p.id === i.id)?.price ?? 0), 0);
  return <CartCtx.Provider value={{ items, add, setQty, clear: () => save([]), count, total }}>{children}</CartCtx.Provider>;
}
export const useCart = () => {
  const c = useContext(CartCtx);
  if (!c) throw new Error("CartProvider missing");
  return c;
};
