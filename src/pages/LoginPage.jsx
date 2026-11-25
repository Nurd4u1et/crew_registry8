import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function LoginPage() {
  useDocumentTitle("Log in");
  const { user, error, clearError, login, loginWithGoogle, isConfigured } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    clearError();
  }, [clearError]);

  if (user) return <Navigate to={location.state?.from?.pathname ?? "/profile"} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    await login(email.trim(), password);
    setBusy(false);
  }

  async function handleGoogle() {
    setBusy(true);
    await loginWithGoogle();
    setBusy(false);
  }

  return (
    <div className="page page-narrow">
      <div className="auth">
        <h1>Log in</h1>

        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={busy || !isConfigured}>
            {busy ? "Logging in…" : "Log in"}
          </button>
        </form>

        <button type="button" className="btn btn-ghost" onClick={handleGoogle} disabled={busy || !isConfigured}>
          Continue with Google
        </button>

        {error && (
          <p className="notice notice-error" role="alert">
            {error}
          </p>
        )}
        {!isConfigured && <p className="notice" role="status">Add Firebase values to .env.local to enable sign-in.</p>}

        <p className="muted">
          No account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

