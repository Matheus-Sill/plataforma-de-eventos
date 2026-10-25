"use client";

import { useState } from "react";
import Link from "next/link";

export type EventFormValues = {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
};

export const emptyEvent: EventFormValues = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  image: "",
};

type Props = {
  initialValues?: EventFormValues;
  submitLabel: string;
  onSubmit: (values: EventFormValues) => Promise<void>;
};

export default function EventForm({
  initialValues = emptyEvent,
  submitLabel,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<EventFormValues>(initialValues);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
      setLoading(false);
    }
  }

  const inputClass = "w-full border border-gray-600 rounded p-2 bg-gray-800 text-white placeholder-gray-400 [color-scheme:dark]";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="bg-red-100 text-red-700 text-sm p-2 rounded">{error}</p>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Título</label>
        <input
          name="title"
          value={values.title}
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descrição</label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          rows={4}
          className={inputClass}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Data</label>
          <input
            type="date"
            name="date"
            value={values.date}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Horário</label>
          <input
            type="time"
            name="time"
            value={values.time}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Local</label>
        <input
          name="location"
          value={values.location}
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          URL da imagem (opcional)
        </label>
        <input
          name="image"
          value={values.image}
          onChange={handleChange}
          placeholder="https://..."
          className={inputClass}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Salvando..." : submitLabel}
        </button>
        <Link href="/admin" className="border px-4 py-2 rounded">
          Cancelar
        </Link>
      </div>
    </form>
  );
}