import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  getAuthErrorMessage,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  signUpWithEmail,
  subscribeToAuth,
} from "../services/authService";
import { isFirebaseConfigured } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToAuth(
      (nextUser) => {
        setUser(nextUser);
        setLoading(false);
      },
      (err) => {
        setError(getAuthErrorMessage(err));
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  const clearError = useCallback(() => setError(""), []);

  const value = useMemo(() => {
    async function run(action) {
      setError("");
      try {
        await action();
        return true;
      } catch (err) {
        setError(getAuthErrorMessage(err));
        return false;
      }
    }

    return {
      user,
      loading,
      error,
      isConfigured: isFirebaseConfigured,
      clearError,
      signup: (email, password) => run(() => signUpWithEmail(email, password)),
      login: (email, password) => run(() => signInWithEmail(email, password)),
      loginWithGoogle: () => run(() => signInWithGoogle()),
      logout: () => run(() => signOutUser()),
    };
  }, [user, loading, error, clearError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

