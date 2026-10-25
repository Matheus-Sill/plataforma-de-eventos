import AsyncStorage from "@react-native-async-storage/async-storage";
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

export type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

type AuthResponse = { token: string; user: User };

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean; // true enquanto restaura a sessão salva
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "@eventos:session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Ao abrir o app, recupera a sessão salva no aparelho
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const session = JSON.parse(raw) as AuthResponse;
          setToken(session.token);
          setUser(session.user);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function saveSession(session: AuthResponse) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setToken(session.token);
    setUser(session.user);
  }

  const signIn = useCallback(async (email: string, password: string) => {
    const data = await apiFetch<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    await saveSession(data);
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const data = await apiFetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: { name, email, password },
      });
      await saveSession(data);
    },
    []
  );

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, signIn, signUp, signOut }),
    [user, token, loading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}