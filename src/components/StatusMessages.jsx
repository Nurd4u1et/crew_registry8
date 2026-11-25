import { Link } from "react-router-dom";

export function Loader({ label = "Loading…" }) {
  return (
    <div className="message" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="message message-error" role="alert">
      <h2>Couldn’t load the data</h2>
      <p>The server answered with: {message}. Try the request again.</p>
      {onRetry && (
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, text, actionLabel, onAction, to }) {
  return (
    <div className="message">
      <h2>{title}</h2>
      <p>{text}</p>
      {onAction && (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
      {to && (
        <Link to={to} className="btn btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

