import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiFetch } from "../api";
import type { Registration } from "../types";
import { useAuth } from "./AuthContext";

type RegistrationsContextValue = {
  registrations: Registration[];
  loading: boolean;
  error: string;
  reload: () => Promise<void>;
  register: (eventId: string) => Promise<void>;
  cancel: (registrationId: string) => Promise<void>;
  findByEvent: (eventId: string) => Registration | undefined;
};

const RegistrationsContext = createContext<RegistrationsContextValue | null>(null);

export function RegistrationsProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch<Registration[]>("/api/registrations", { token });
      setRegistrations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar inscrições");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    reload();
  }, [reload]);

  const register = useCallback(
    async (eventId: string) => {
      const created = await apiFetch<Registration>(
        `/api/events/${eventId}/registrations`,
        { method: "POST", token }
      );
      setRegistrations((prev) => [created, ...prev]);
    },
    [token]
  );

  const cancel = useCallback(
    async (registrationId: string) => {
      await apiFetch(`/api/registrations/${registrationId}`, {
        method: "DELETE",
        token,
      });
      setRegistrations((prev) => prev.filter((r) => r.id !== registrationId));
    },
    [token]
  );

  const findByEvent = useCallback(
    (eventId: string) => registrations.find((r) => r.eventId === eventId),
    [registrations]
  );

  const value = useMemo(
    () => ({ registrations, loading, error, reload, register, cancel, findByEvent }),
    [registrations, loading, error, reload, register, cancel, findByEvent]
  );

  return (
    <RegistrationsContext.Provider value={value}>
      {children}
    </RegistrationsContext.Provider>
  );
}

export function useRegistrations() {
  const ctx = useContext(RegistrationsContext);
  if (!ctx) {
    throw new Error("useRegistrations deve ser usado dentro de RegistrationsProvider");
  }
  return ctx;
}