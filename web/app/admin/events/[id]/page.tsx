"use client";

import { useEffect, useState } from "react";
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

export default function EventDetailPage() {
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
    <main className="max-w-xl mx-auto p-6">
      <Link href="/admin" className="text-sm text-blue-600">
        ← Voltar
      </Link>

      {loading && <p className="mt-4">Carregando...</p>}
      {error && (
        <p className="mt-4 bg-red-100 text-red-700 p-2 rounded">{error}</p>
      )}

      {event && (
        <article className="mt-4 space-y-3">
          {event.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.image}
              alt={event.title}
              className="w-full rounded-lg"
            />
          )}
          <h1 className="text-2xl font-bold">{event.title}</h1>
          <p className="text-gray-600">
            {new Date(event.date).toLocaleDateString("pt-BR", {
              timeZone: "UTC",
            })}{" "}
            às {event.time} · {event.location}
          </p>
          <p className="whitespace-pre-line">{event.description}</p>

          <Link
            href={`/admin/events/${event.id}/edit`}
            className="inline-block bg-green-700 text-white px-4 py-2 rounded"
          >
            Editar evento
          </Link>
        </article>
      )}
    </main>
  );
}