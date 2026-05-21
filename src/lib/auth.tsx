"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { moondb } from "./moondb";

type User = {
  id: string;
  email: string;
  display_name?: string;
};

type AuthCtx = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const persist = (t: string, rt: string, u: User) => {
    localStorage.setItem("token", t);
    localStorage.setItem("refresh_token", rt);
    setToken(t);
    setUser(u);
  };

  const clear = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    setToken(null);
    setUser(null);
  };

  const refresh = useCallback(async () => {
    const rt = localStorage.getItem("refresh_token");
    if (!rt) return null;
    try {
      const res = await moondb("/auth/refresh", {
        method: "POST",
        body: { refresh_token: rt },
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      setToken(res.data.token);
      return res.data.token;
    } catch {
      clear();
      return null;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const t = localStorage.getItem("token");
      if (!t) {
        setLoading(false);
        return;
      }
      try {
        const res = await moondb("/auth/me", { token: t });
        setToken(t);
        setUser(res.data.user ?? res.data);
      } catch {
        const newToken = await refresh();
        if (newToken) {
          try {
            const res = await moondb("/auth/me", { token: newToken });
            setUser(res.data.user ?? res.data);
          } catch {
            clear();
          }
        }
      }
      setLoading(false);
    };
    init();
  }, [refresh]);

  const login = async (email: string, password: string) => {
    const res = await moondb("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    persist(res.data.token, res.data.refresh_token, res.data.user);
  };

  const signup = async (email: string, password: string) => {
    const res = await moondb("/auth/signup", {
      method: "POST",
      body: { email, password },
    });
    persist(res.data.token, res.data.refresh_token, res.data.user);
  };

  const logout = () => {
    if (token) {
      moondb("/auth/logout", { method: "POST", token }).catch(() => {});
    }
    clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
