# NEXUS Tecnología

Tienda y servicio técnico de computadores: catálogo, carrito, envíos nacionales, citas, "Arma tu PC", contacto y panel de administración.

**Cómo funcionan los pedidos:** el cliente arma su carrito, llena sus datos y el pedido completo (productos, total, datos de envío y forma de pago) llega al WhatsApp del negocio. El costo del envío y el link de pago (Bold, Wompi u otro) se envían de forma manual por WhatsApp.

Stack: TanStack Start (React 19) · Supabase · Tailwind 4 · Nitro.

## Despliegue en Vercel

1. Importa este repositorio en Vercel (**Add New → Project**). Detecta todo solo (usa `bun.lock`).
2. Este repo ya incluye `.env` con las claves públicas de Supabase, así que Vercel puede compilar sin configurar nada. Si prefieres definirlas en **Settings → Environment Variables**, estas son (ver `.env.example`):

| Variable | Para qué sirve |
| --- | --- |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` | Navegador (se incrustan al compilar) |
| `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_PROJECT_ID` | Servidor / SSR |

3. Pulsa **Deploy**. Si cambias una variable `VITE_*`, haz **Redeploy** (se leen al compilar).

El proyecto fija `nitro: { preset: "vercel" }` en `vite.config.ts`, así `vite build` genera `.vercel/output`. Dentro de Lovable ese ajuste se ignora, por lo que ambos entornos siguen funcionando.

El número de WhatsApp está en `src/lib/shop.tsx` (constante `WHATSAPP`).

## Desarrollo local

```sh
cp .env.example .env   # y completa los valores
bun install            # o: npm i --legacy-peer-deps
bun run dev
```

## Lovable

Este proyecto sigue conectado con [Lovable](https://lovable.dev/projects/90e9b02d-164d-478f-a7dc-84037b244c8f). Los cambios que se suban a `main` en GitHub se sincronizan con el editor.
