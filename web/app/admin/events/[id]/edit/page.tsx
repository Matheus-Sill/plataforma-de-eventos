"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import EventForm, { EventFormValues } from "@/components/EventForm";
import { apiFetch } from "@/lib/api-client";
import { useRequireAdmin } from "@/lib/use-require-admin";

function EditEventContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const ready = useRequireAdmin();

  const [initialValues, setInitialValues] =
    useState<EventFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) return;

    apiFetch(`/api/events/${id}`)
      .then((event) =>
        setInitialValues({
          title: event.title,
          description: event.description,
          date: event.date.slice(0, 10),
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
    <main className="mx-auto max-w-2xl p-6 text-white">
      <Link href="/admin" className="text-sm text-blue-400 hover:text-blue-300">
        ← Voltar ao painel
      </Link>

      <section className="mt-5 rounded-2xl border border-white/10 bg-gray-900 p-6">
        <h1 className="mb-6 text-2xl font-bold">Editar evento</h1>

        {loading && <p className="text-gray-400">Carregando...</p>}

        {error && (
          <p className="mb-4 rounded bg-red-500/10 p-3 text-red-400">
            {error}
          </p>
        )}

        {initialValues && (
          <EventForm
            initialValues={initialValues}
            submitLabel="Salvar alterações"
            onSubmit={handleUpdate}
          />
        )}
      </section>
    </main>
  );
}

export default function EditEventPage() {
  return (
    <Suspense fallback={<p className="p-6 text-gray-400">Carregando...</p>}>
      <EditEventContent />
    </Suspense>
  );
}
