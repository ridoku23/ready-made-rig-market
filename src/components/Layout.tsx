import { Link } from "@tanstack/react-router";
import { MessageCircle, ShoppingCart } from "lucide-react";
import logo from "@/assets/nexus-logo.jpg";
import { useCart, waLink } from "@/lib/shop";

const nav = [
  { to: "/catalogo", label: "Tienda" },
  { to: "/arma-tu-pc", label: "Arma tu PC" },
  { to: "/servicios", label: "Servicios" },
  { to: "/citas", label: "Citas" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function Header() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="NEXUS Tecnología" className="h-12 w-auto rounded" width={520} height={340} />
        </Link>
        <nav className="ml-auto hidden gap-6 text-sm font-medium md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="text-muted-foreground hover:text-accent" activeProps={{ className: "text-accent" }}>{n.label}</Link>
          ))}
        </nav>
        <Link to="/carrito" className="relative ml-auto rounded-full border p-2 md:ml-0" aria-label="Carrito">
          <ShoppingCart className="h-5 w-5" />
          {count > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1.5 text-xs">{count}</span>}
        </Link>
      </div>
      <nav className="flex justify-center gap-3 overflow-x-auto px-2 pb-2 text-xs md:hidden">
        {nav.map((n) => <Link key={n.to} to={n.to} className="text-muted-foreground" activeProps={{ className: "text-accent" }}>{n.label}</Link>)}
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t py-10 text-center text-sm text-muted-foreground">
      <p className="font-display tracking-[0.4em] text-foreground">TU ALIADO EN TECNOLOGÍA</p>
      <p className="mt-3">WhatsApp 301 600 0986 · Envíos a todo Colombia · Efectivo, transferencia y tarjeta</p>
    </footer>
  );
}

export function WhatsAppFab() {
  return (
    <a href={waLink("Hola NEXUS, quiero información.")} target="_blank" rel="noreferrer" aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 font-semibold text-primary-foreground shadow-lg">
      <MessageCircle className="h-5 w-5" /> <span className="hidden sm:inline">Contáctanos</span>
    </a>
  );
}
