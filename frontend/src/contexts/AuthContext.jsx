import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);
const storedUserKey = "restaurant_user";
const storedTokenKey = "restaurant_access_token";

function getStoredUser() {
  const rawUser = localStorage.getItem(storedUserKey);
  return rawUser ? JSON.parse(rawUser) : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [isSessionLoading, setIsSessionLoading] = useState(Boolean(localStorage.getItem(storedTokenKey)));

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      const token = localStorage.getItem(storedTokenKey);

      if (!token) {
        setIsSessionLoading(false);
        return;
      }

      try {
        const currentUser = await authService.fetchCurrentUser();

        if (isMounted) {
          localStorage.setItem(storedUserKey, JSON.stringify(currentUser));
          setUser(currentUser);
        }
      } catch {
        logout();
      } finally {
        if (isMounted) {
          setIsSessionLoading(false);
        }
      }
    }

    function handleUnauthorized() {
      setUser(null);
      setIsSessionLoading(false);
    }

    window.addEventListener("restaurant:unauthorized", handleUnauthorized);
    restoreSession();

    return () => {
      isMounted = false;
      window.removeEventListener("restaurant:unauthorized", handleUnauthorized);
    };
  }, []);

  async function login(credentials) {
    const session = await authService.login(credentials);
    localStorage.setItem(storedUserKey, JSON.stringify(session.user));
    localStorage.setItem(storedTokenKey, session.token);
    setUser(session.user);
    return session.user;
  }

  function logout() {
    localStorage.removeItem(storedUserKey);
    localStorage.removeItem(storedTokenKey);
    setUser(null);
  }

  async function register(data) {
    const session = await authService.register(data);
    localStorage.setItem(storedUserKey, JSON.stringify(session.user));
    localStorage.setItem(storedTokenKey, session.token);
    setUser(session.user);
    return session.user;
  }

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      isSessionLoading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "ADMIN",
    }),
    [isSessionLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}
