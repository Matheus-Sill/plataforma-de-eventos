import { API_URL } from "./config";

type Options = {
  method?: string;
  body?: unknown;
  token?: string | null;
};

export async function apiFetch<T = any>(
  path: string,
  { method = "GET", body, token }: Options = {}
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(
        data?.details?.join(", ") ?? data?.error ?? "Erro na requisição"
      );
    }

    return data as T;
  } catch (err) {
    if (
      err instanceof Error &&
      (err.name === "AbortError" || err.message.includes("Network request failed"))
    ) {
      throw new Error(
        "Não foi possível conectar ao servidor. Verifique sua conexão."
      );
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}