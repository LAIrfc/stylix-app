"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, "name" | "avatar">>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "stylix-auth-user";

function generateId() {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch { /* ignore */ }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback(async (email: string, _password: string): Promise<{ ok: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 600));

    if (!email.includes("@")) {
      return { ok: false, error: "invalid_email" };
    }

    const existing = localStorage.getItem(`stylix-users-${email}`);
    if (existing) {
      const u = JSON.parse(existing) as User;
      setUser(u);
      return { ok: true };
    }

    const u: User = {
      id: generateId(),
      email,
      name: email.split("@")[0],
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(`stylix-users-${email}`, JSON.stringify(u));
    setUser(u);
    return { ok: true };
  }, []);

  const register = useCallback(async (email: string, _password: string, name: string): Promise<{ ok: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 600));

    if (!email.includes("@")) {
      return { ok: false, error: "invalid_email" };
    }

    const u: User = {
      id: generateId(),
      email,
      name,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(`stylix-users-${email}`, JSON.stringify(u));
    setUser(u);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates: Partial<Pick<User, "name" | "avatar">>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem(`stylix-users-${prev.email}`, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout, updateProfile }),
    [user, isLoading, login, register, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
