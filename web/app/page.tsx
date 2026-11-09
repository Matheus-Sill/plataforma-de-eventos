"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";

type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string | null;
};

export default function Home() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/api/events")
      .then(setEvents)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Erro ao carregar eventos")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#0b0f19] text-white">
      <header className="border-b border-white/10 bg-[#111827]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-green-400">Evento</span>Hub
          </Link>

          <Link
            href="/admin/login"
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-gray-200 transition hover:bg-white/10"
          >
            Área administrativa
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-green-400">
            Plataforma de eventos
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Eventos disponíveis
          </h1>
          <p className="mt-4 max-w-2xl text-gray-400">
            Confira os eventos disponíveis e encontre sua próxima experiência.
          </p>
        </div>

        {loading && (
          <p className="py-10 text-center text-gray-400">Carregando eventos...</p>
        )}

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </p>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-[#151c2b] p-10 text-center">
            <h2 className="text-xl font-semibold">Nenhum evento disponível</h2>
            <p className="mt-2 text-gray-400">
              Os próximos eventos aparecerão nesta página.
            </p>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.id}
              className="overflow-hidden rounded-xl border border-white/10 bg-[#151c2b] transition hover:-translate-y-1 hover:border-green-400/40"
            >
              {event.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center bg-gradient-to-br from-green-900 to-slate-900 text-5xl">
                  📅
                </div>
              )}

              <div className="p-5">
                <h2 className="text-xl font-semibold">{event.title}</h2>

                <p className="mt-3 line-clamp-3 text-sm text-gray-400">
                  {event.description}
                </p>

                <div className="mt-5 space-y-2 text-sm text-gray-300">
                  <p>📅 {new Date(event.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</p>
                  <p>🕒 {event.time}</p>
                  <p>📍 {event.location}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-sm text-gray-500">
        EventoHub — Plataforma de gerenciamento de eventos
      </footer>
    </main>
  );
}
