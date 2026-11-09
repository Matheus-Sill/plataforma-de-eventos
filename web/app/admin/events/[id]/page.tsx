"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { useRequireAdmin } from "@/lib/use-require-admin";

type EventDetail = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string | null;
};

function EventDetailContent() {
  const { id } = useParams<{ id: string }>();
  const ready = useRequireAdmin();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) return;

    apiFetch(`/api/events/${id}`)
      .then(setEvent)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Erro ao carregar evento")
      )
      .finally(() => setLoading(false));
  }, [ready, id]);

  if (!ready) return null;

  return (
    <main className="mx-auto max-w-3xl p-6 text-white">
      <Link href="/admin" className="text-sm text-blue-400 hover:text-blue-300">
        ← Voltar ao painel
      </Link>

      {loading && <p className="mt-6 text-gray-400">Carregando evento...</p>}

      {error && (
        <p className="mt-4 rounded bg-red-500/10 p-3 text-red-400">
          {error}
        </p>
      )}

      {event && (
        <article className="mt-6 space-y-5 rounded-2xl border border-white/10 bg-gray-900 p-6">
          {event.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.image}
              alt={event.title}
              className="max-h-96 w-full rounded-xl object-cover"
            />
          )}

          <h1 className="text-3xl font-bold">{event.title}</h1>

          <p className="text-gray-400">
            {new Date(event.date).toLocaleDateString("pt-BR", {
              timeZone: "UTC",
            })}{" "}
            às {event.time} · {event.location}
          </p>

          <p className="whitespace-pre-line leading-7 text-gray-300">
            {event.description}
          </p>

          <Link
            href={`/admin/events/${event.id}/edit`}
            className="inline-block rounded-lg bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-500"
          >
            Editar evento
          </Link>
        </article>
      )}
    </main>
  );
}

export default function EventDetailPage() {
  return (
    <Suspense fallback={<p className="p-6 text-gray-400">Carregando...</p>}>
      <EventDetailContent />
    </Suspense>
  );
}
