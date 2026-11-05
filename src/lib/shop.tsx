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
  { id: "pc-creador", name: "PC Creador de contenido", category: "PC ensamblados", price: 4100000, image: pc, desc: "Intel Core i7, RTX, 32GB RAM, SSD 2TB" },
  { id: "ram-16", name: "Memoria RAM DDR5 16GB", category: "Componentes", price: 260000, image: comp, desc: "5600 MHz con disipador" },
  { id: "ssd-1tb", name: "SSD NVMe 1TB", category: "Componentes", price: 320000, image: comp, desc: "Hasta 7000 MB/s" },
  { id: "teclado-mec", name: "Teclado mecánico RGB", category: "Accesorios", price: 190000, image: peri, desc: "Switches rojos, español" },
];

export type BuildPart = { name: string; price: number };
export const BUILDER: { step: string; options: BuildPart[] }[] = [
  { step: "Procesador", options: [{ name: "AMD Ryzen 5 5600", price: 520000 }, { name: "AMD Ryzen 7 7700", price: 1250000 }, { name: "Intel Core i5-12400F", price: 560000 }, { name: "Intel Core i7-13700K", price: 1650000 }] },
  { step: "Board", options: [{ name: "B550 (AM4)", price: 480000 }, { name: "B650 (AM5)", price: 780000 }, { name: "B760 (Intel)", price: 620000 }] },
  { step: "Memoria RAM", options: [{ name: "16GB DDR4", price: 180000 }, { name: "32GB DDR5", price: 480000 }, { name: "64GB DDR5", price: 920000 }] },
  { step: "Almacenamiento", options: [{ name: "SSD NVMe 512GB", price: 190000 }, { name: "SSD NVMe 1TB", price: 320000 }, { name: "SSD NVMe 2TB", price: 590000 }] },
  { step: "Tarjeta gráfica", options: [{ name: "Gráficos integrados", price: 0 }, { name: "RTX 4060 8GB", price: 1450000 }, { name: "RTX 4070 12GB", price: 2600000 }] },
  { step: "Fuente de poder", options: [{ name: "650W 80+ Bronze", price: 260000 }, { name: "850W 80+ Gold", price: 480000 }] },
  { step: "Chasis", options: [{ name: "Chasis RGB vidrio templado", price: 290000 }, { name: "Chasis premium 4 ventiladores", price: 450000 }] },
];
export const ASSEMBLY_FEE = 120000;

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
