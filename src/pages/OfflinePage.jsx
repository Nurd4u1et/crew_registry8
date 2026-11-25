import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function OfflinePage() {
  const navigate = useNavigate();
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return (
    <section className="offline-page" aria-labelledby="offline-title">
      <p className="eyebrow">Crew Registry</p>
      <h1 id="offline-title">{online ? "You are back online" : "You are offline"}</h1>
      <p>
        {online
          ? "Your connection is back. Return to the crew registry to continue."
          : "Previously saved crew records remain on this device. Reconnect to refresh the app and any data that needs a network connection."}
      </p>
      <div className="offline-actions">
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => (navigator.onLine ? navigate("/", { replace: true }) : window.location.reload())}
        >
          {online ? "Return to app" : "Retry connection"}
        </button>
        <Link className="btn btn-ghost" to="/crew">Open saved crew</Link>
      </div>
    </section>
  );
}

