"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, saveSession } from "@/lib/api-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data.user.role !== "ADMIN") {
        throw new Error("Acesso restrito a administradores");
      }

      saveSession(data.token, data.user);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow space-y-4"
      >
        <h1 className="text-xl font-bold text-gray-900">Painel do Administrador</h1>

        {error && (
          <p className="bg-red-100 text-red-700 text-sm p-2 rounded">{error}</p>
        )}

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded p-2 text-gray-900"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded p-2 text-gray-900"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 text-white rounded p-2 font-medium disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}