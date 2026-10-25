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
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir");
    }
  }

  function handleLogout() {
    clearSession();
    router.replace("/admin/login");
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Eventos</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/events/new"
            className="bg-green-700 text-white px-4 py-2 rounded"
          >
            Novo evento
          </Link>
          <button onClick={handleLogout} className="border px-4 py-2 rounded">
            Sair
          </button>
        </div>
      </header>

      {loading && <p>Carregando...</p>}
      {error && <p className="bg-red-100 text-red-700 p-2 rounded">{error}</p>}
      {!loading && !error && events.length === 0 && <p>Nenhum evento cadastrado.</p>}

      <ul className="space-y-3">
        {events.map((event) => (
          <li
            key={event.id}
            className="border rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <h2 className="font-semibold">{event.title}</h2>
              <p className="text-sm text-gray-600">
                {new Date(event.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}{" "}
                às {event.time} · {event.location}
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <Link href={`/admin/events/${event.id}`} className="text-blue-600">
                Detalhes
              </Link>
              <Link href={`/admin/events/${event.id}/edit`} className="text-green-700">
                Editar
              </Link>
              <button onClick={() => handleDelete(event.id)} className="text-red-600">
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}