"use client";

import { useRouter } from "next/navigation";
import EventForm, { EventFormValues } from "@/components/EventForm";
import { apiFetch } from "@/lib/api-client";
import { useRequireAdmin } from "@/lib/use-require-admin";

export default function NewEventPage() {
  const router = useRouter();
  const ready = useRequireAdmin();

  async function handleCreate(values: EventFormValues) {
    await apiFetch("/api/events", {
      method: "POST",
      body: JSON.stringify(values),
    });
    router.push("/admin");
  }

  if (!ready) return null;

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Novo evento</h1>
      <EventForm submitLabel="Cadastrar evento" onSubmit={handleCreate} />
    </main>
  );
}