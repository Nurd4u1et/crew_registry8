import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function SignupPage() {
  useDocumentTitle("Sign up");
  const { user, error, clearError, signup, loginWithGoogle, isConfigured } = useAuth();
  const [values, setValues] = useState({ email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    clearError();
  }, [clearError]);

  if (user) return <Navigate to="/profile" replace />;

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) next.email = "Enter a valid email.";
    if (values.password.length < 6) next.password = "At least 6 characters.";
    if (values.confirm !== values.password) next.confirm = "Passwords do not match.";
    return next;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setBusy(true);
    await signup(values.email.trim(), values.password);
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
        <h1>Sign up</h1>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Email</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <small className="field-error">{errors.email}</small>}
          </label>
          <label className="field">
            <span>Password</span>
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              value={values.password}
              onChange={handleChange}
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && <small className="field-error">{errors.password}</small>}
          </label>
          <label className="field">
            <span>Confirm password</span>
            <input
              name="confirm"
              type="password"
              autoComplete="new-password"
              value={values.confirm}
              onChange={handleChange}
              aria-invalid={Boolean(errors.confirm)}
            />
            {errors.confirm && <small className="field-error">{errors.confirm}</small>}
          </label>
          <button type="submit" className="btn btn-primary" disabled={busy || !isConfigured}>
            {busy ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <button type="button" className="btn btn-ghost" onClick={handleGoogle} disabled={busy || !isConfigured}>
          Sign up with Google
        </button>

        {error && (
          <p className="notice notice-error" role="alert">
            {error}
          </p>
        )}
        {!isConfigured && <p className="notice" role="status">Add Firebase values to .env.local to enable account creation.</p>}

        <p className="muted">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

