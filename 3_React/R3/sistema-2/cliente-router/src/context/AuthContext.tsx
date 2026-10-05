import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import {
  loginRequest,
  logoutRequest,
  registerRequest,
  sessionRequest,
  type AuthValues,
} from "@/services/authService";
import type { User } from "@/types/user";

interface AuthContextValue {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  login: (values: AuthValues) => Promise<User>;
  register: (values: AuthValues) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // al abrir la app pregunto si ya hay una sesión activa (cookie)
  useEffect(() => {
    sessionRequest()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(values: AuthValues): Promise<User> {
    const loggedUser = await loginRequest(values);
    setUser(loggedUser);
    return loggedUser;
  }

  async function register(values: AuthValues): Promise<User> {
    const newUser = await registerRequest(values);
    setUser(newUser);
    return newUser;
  }

  async function logout(): Promise<void> {
    await logoutRequest();
    setUser(null);
  }

  const value: AuthContextValue = { user, setUser, loading, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextValue => useContext(AuthContext)!;
