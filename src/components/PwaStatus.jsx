import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cachedSnapshotUsed, connectivityChanged } from "../store/appSlice";
import { selectOnline } from "../store/selectors";

export default function PwaStatus() {
  const dispatch = useDispatch();
  const online = useSelector(selectOnline);
  const cachedSnapshot = useSelector((state) => state.app.cachedSnapshot);
  const [waitingWorker, setWaitingWorker] = useState(null);
  const applyingUpdate = useRef(false);

  useEffect(() => {
    const updateOnline = () => dispatch(connectivityChanged(navigator.onLine));
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    const reloadUpdatedApp = () => {
      if (applyingUpdate.current) window.location.reload();
    };
    navigator.serviceWorker?.addEventListener("controllerchange", reloadUpdatedApp);
    const cacheUsed = () => dispatch(cachedSnapshotUsed());
    window.addEventListener("crew-cache-used", cacheUsed);

    if (!("serviceWorker" in navigator)) {
      return () => {
        window.removeEventListener("online", updateOnline);
        window.removeEventListener("offline", updateOnline);
        window.removeEventListener("crew-cache-used", cacheUsed);
        navigator.serviceWorker?.removeEventListener("controllerchange", reloadUpdatedApp);
      };
    }

    let registration;
    let installListener;
    navigator.serviceWorker.getRegistration().then((current) => {
      if (!current) return;
      registration = current;
      if (current.waiting && navigator.serviceWorker.controller) setWaitingWorker(current.waiting);
      installListener = () => {
        const worker = current.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            setWaitingWorker(worker);
          }
        });
      };
      current.addEventListener("updatefound", installListener);
    });

    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
      window.removeEventListener("crew-cache-used", cacheUsed);
      navigator.serviceWorker?.removeEventListener("controllerchange", reloadUpdatedApp);
      if (registration && installListener) registration.removeEventListener("updatefound", installListener);
    };
  }, [dispatch]);

  const activateUpdate = () => {
    applyingUpdate.current = true;
    waitingWorker?.postMessage({ type: "SKIP_WAITING" });
  };

  return (
    <div className="pwa-status" aria-live="polite">
      <p className={`connectivity-banner connectivity-${online ? "online" : "offline"}`} role="status">
        <span className="connectivity-dot" />
        {online ? "Online" : "Offline · showing saved crew data where available."}
      </p>
      {online && cachedSnapshot && (
        <p className="connectivity-banner" role="status">
          A request failed · showing a saved crew response.
        </p>
      )}
      {waitingWorker && (
        <p className="update-banner" role="status">
          A new version is ready.
          <button type="button" className="update-button" onClick={activateUpdate}>Update now</button>
        </p>
      )}
    </div>
  );
}

