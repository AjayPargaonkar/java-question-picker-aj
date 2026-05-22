import { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { recordLogin } from "../lib/db";

type AuthValue = {
  user: string | null;
  signIn: (name: string, email?: string) => void;
  signOut: () => void;
};

const AuthCtx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<string | null>("java_practice_user", null);
  const value: AuthValue = {
    user,
    signIn: (name, email) => {
      setUser(name);
      // persist the login record to IndexedDB (username + optional email)
      void recordLogin(name, email);
    },
    signOut: () => setUser(null),
  };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
