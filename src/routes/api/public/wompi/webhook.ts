import { createFileRoute } from "@tanstack/react-router";

async function sha256Hex(text: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const Route = createFileRoute("/api/public/wompi/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["WOMPI_EVENTS_SECRET"];
        if (!secret) return new Response("Wompi events secret not configured", { status: 500 });

        const body = (await request.json()) as {
          data?: { transaction?: { id: string; status: string; amount_in_cents: number; reference: string } };
          timestamp?: number;
          signature?: { checksum?: string };
        };
        const t = body.data?.transaction;
        const timestamp = body.timestamp;
        const checksum = body.signature?.checksum;
        if (!t || !timestamp || !checksum) return new Response("Bad request", { status: 400 });

        const expected = await sha256Hex(`${t.id}${t.status}${t.amount_in_cents}${timestamp}${secret}`);
        if (expected !== checksum) return new Response("Invalid signature", { status: 401 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin
          .from("orders")
          .update({ status: t.status.toLowerCase(), wompi_transaction_id: t.id })
          .eq("reference", t.reference);
        if (error) return new Response(error.message, { status: 500 });

        return Response.json({ ok: true });
      },
    },
  },
});
