import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const WHATSAPP = "573016000986";
export const waLink = (text: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

export type CartProduct = { id: string; name: string; price: number; image: string };

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

export type CartItem = CartProduct & { qty: number };
type Ctx = { items: CartItem[]; add: (p: CartProduct) => void; setQty: (id: string, q: number) => void; clear: () => void; count: number; total: number };
const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("nexus-cart") || "[]") as CartItem[];
      // Drop legacy entries saved before the cart stored full product data.
      setItems(raw.filter((i) => i && typeof i.price === "number" && typeof i.name === "string"));
    } catch { /* ignore */ }
  }, []);
  const save = (next: CartItem[]) => { setItems(next); localStorage.setItem("nexus-cart", JSON.stringify(next)); };
  const add = (p: CartProduct) => {
    const f = items.find((i) => i.id === p.id);
    save(f ? items.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i)) : [...items, { ...p, qty: 1 }]);
  };
  const setQty = (id: string, q: number) => save(q <= 0 ? items.filter((i) => i.id !== id) : items.map((i) => (i.id === id ? { ...i, qty: q } : i)));
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);
  return <CartCtx.Provider value={{ items, add, setQty, clear: () => save([]), count, total }}>{children}</CartCtx.Provider>;
}
export const useCart = () => {
  const c = useContext(CartCtx);
  if (!c) throw new Error("CartProvider missing");
  return c;
};
