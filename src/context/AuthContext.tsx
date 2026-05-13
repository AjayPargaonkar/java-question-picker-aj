import { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type AuthValue = {
  user: string | null;
  signIn: (name: string) => void;
  signOut: () => void;
};

const AuthCtx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<string | null>("java_practice_user", null);
  const value: AuthValue = {
    user,
    signIn: (name) => setUser(name),
    signOut: () => setUser(null),
  };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
