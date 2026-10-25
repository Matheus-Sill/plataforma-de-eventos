"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import EventForm, { EventFormValues } from "@/components/EventForm";
import { apiFetch } from "@/lib/api-client";
import { useRequireAdmin } from "@/lib/use-require-admin";

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const ready = useRequireAdmin();
  const [initialValues, setInitialValues] = useState<EventFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) return;

    apiFetch(`/api/events/${id}`)
      .then((event) =>
        setInitialValues({
          title: event.title,
          description: event.description,
          date: event.date.slice(0, 10), // "2026-11-10T00:00:00.000Z" -> "2026-11-10"
          time: event.time,
          location: event.location,
          image: event.image ?? "",
        })
      )
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Erro ao carregar evento")
      )
      .finally(() => setLoading(false));
  }, [ready, id]);

  async function handleUpdate(values: EventFormValues) {
    await apiFetch(`/api/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });
    router.push("/admin");
  }

  if (!ready) return null;

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Editar evento</h1>

      {loading && <p>Carregando...</p>}
      {error && <p className="bg-red-100 text-red-700 p-2 rounded">{error}</p>}

      {initialValues && (
        <EventForm
          initialValues={initialValues}
          submitLabel="Salvar alterações"
          onSubmit={handleUpdate}
        />
      )}
    </main>
  );
}