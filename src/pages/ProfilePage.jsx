import { useAuth } from "../context/AuthContext";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function ProfilePage() {
  useDocumentTitle("Profile");
  const { user, logout, error } = useAuth();

  return (
    <div className="page page-narrow">
      <h1>Profile</h1>

      <dl className="details">
        <div className="detail">
          <dt>Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div className="detail">
          <dt>UID</dt>
          <dd>{user.uid}</dd>
        </div>
      </dl>

      {error && (
        <p className="notice notice-error" role="alert">
          {error}
        </p>
      )}

      <div className="actions-row">
        <button type="button" className="btn btn-danger" onClick={logout}>
          Log out
        </button>
      </div>
    </div>
  );
}

