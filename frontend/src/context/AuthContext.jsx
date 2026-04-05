import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { api, clearAuth, getStoredUser, getToken, setAuth } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getToken());

  const login = useCallback(async (email, password) => {
    const data = await api.login({ email, password });
    setAuth(data.access_token, data.user);
    setToken(data.access_token);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    await api.register({ name, email, password });
    return login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((next) => {
    setUser(next);
    if (next) localStorage.setItem("healbuddy_user", JSON.stringify(next));
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
      updateUser,
    }),
    [user, token, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
