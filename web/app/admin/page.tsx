"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, clearSession, getSessionUser } from "@/lib/api-client";

type EventItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadEvents() {
    try {
      setError("");
      const data = await apiFetch("/api/events");
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar eventos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const user = getSessionUser();

    if (!user || user.role !== "ADMIN") {
      router.replace("/admin/login");
      return;
    }

    loadEvents();
  }, [router]);

  async function handleDelete(id: string) {
    if (!confirm("Deseja realmente excluir este evento?")) return;

    try {
      await apiFetch(`/api/events/${id}`, { method: "DELETE" });
      setEvents((previous) => previous.filter((event) => event.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir evento");
    }
  }

  function handleLogout() {
    clearSession();
    router.replace("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#0b0f19] px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-green-400">
              EventoHub
            </p>
            <h1 className="text-3xl font-bold">Eventos</h1>
            <p className="mt-2 text-sm text-gray-400">
              Gerencie os eventos cadastrados na plataforma.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/events/new"
              className="rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-500"
            >
              + Novo evento
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-white/15 px-5 py-3 text-sm text-gray-300 transition hover:bg-white/10"
            >
              Sair
            </button>
          </div>
        </header>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-[#151c2b] p-5">
            <p className="text-sm text-gray-400">Total de eventos</p>
            <p className="mt-2 text-3xl font-bold">{events.length}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#151c2b] p-5">
            <p className="text-sm text-gray-400">Painel administrativo</p>
            <p className="mt-2 text-lg font-semibold text-green-400">
              Gerenciamento ativo
            </p>
          </div>
        </div>

        {loading && (
          <p className="py-8 text-center text-gray-400">Carregando eventos...</p>
        )}

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </p>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-[#151c2b] p-10 text-center">
            <h2 className="text-xl font-semibold">Nenhum evento cadastrado</h2>
            <p className="mt-2 text-gray-400">
              Comece cadastrando o primeiro evento da plataforma.
            </p>
            <Link
              href="/admin/events/new"
              className="mt-5 inline-block rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold hover:bg-green-500"
            >
              Cadastrar primeiro evento
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {events.map((event) => (
            <article
              key={event.id}
              className="flex flex-col justify-between gap-5 rounded-xl border border-white/10 bg-[#151c2b] p-5 transition hover:border-white/20 sm:flex-row sm:items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{event.title}</h2>
                <p className="mt-2 text-sm text-gray-400">
                  {new Date(event.date).toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  })}{" "}
                  às {event.time} · {event.location}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-sm">
                <Link
                  href={`/admin/events/${event.id}`}
                  className="rounded-lg bg-blue-600/15 px-4 py-2 font-medium text-blue-400 transition hover:bg-blue-600/25"
                >
                  Detalhes
                </Link>

                <Link
                  href={`/admin/events/${event.id}/edit`}
                  className="rounded-lg bg-green-600/15 px-4 py-2 font-medium text-green-400 transition hover:bg-green-600/25"
                >
                  Editar
                </Link>

                <button
                  onClick={() => handleDelete(event.id)}
                  className="rounded-lg bg-red-600/15 px-4 py-2 font-medium text-red-400 transition hover:bg-red-600/25"
                >
                  Excluir
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
