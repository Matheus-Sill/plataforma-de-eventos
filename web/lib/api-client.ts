export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

export function saveSession(token: string, user: SessionUser) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getSessionUser(): SessionUser | null {
  const raw = localStorage.getItem("user");
  return raw ? (JSON.parse(raw) as SessionUser) : null;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.details?.join(", ") ?? data?.error ?? "Erro na requisição";
    throw new Error(message);
  }

  return data;
}