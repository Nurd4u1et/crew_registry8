import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Avatar from "../components/Avatar";
import RankPips from "../components/RankPips";
import StatusBadge from "../components/StatusBadge";
import { EmptyState, ErrorMessage, Loader } from "../components/StatusMessages";
import { STATUSES } from "../constants";
import useCrewMember from "../hooks/useCrewMember";
import { useDeleteCrewMember, useEditCrewMember } from "../hooks/useCrewMutations";
import useDocumentTitle from "../hooks/useDocumentTitle";

function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function CrewDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const validId = /^\d+$/.test(id);
  const { phase, member, error, reload } = useCrewMember(validId ? id : null);
  const editMutation = useEditCrewMember();
  const deleteMutation = useDeleteCrewMember();

  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  useDocumentTitle(member ? member.name : "Crew member");
  const listLink = `/crew${location.state?.from ?? ""}`;

  function goBack() {
    if (location.key !== "default") navigate(-1);
    else navigate("/crew");
  }

  async function changeStatus(status) {
    if (status === member.status) return;
    setBusy(true);
    setActionError("");
    try {
      await editMutation.mutateAsync({ id: member.id, changes: { status } });
    } catch (err) {
      setActionError(`Status wasn’t changed: ${err.message}`);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Remove ${member.name} from the registry?`)) return;
    setBusy(true);
    setActionError("");
    try {
      await deleteMutation.mutateAsync(member.id);
      navigate("/crew", { replace: true });
    } catch (err) {
      setActionError(`Crew member wasn’t removed: ${err.message}`);
      setBusy(false);
    }
  }

  const nav = (
    <div className="crumbs">
      <button type="button" className="link-btn" onClick={goBack}>
        ← Back
      </button>
      <Link to={listLink}>All crew</Link>
    </div>
  );

  if (phase === "loading") {
    return (
      <div className="page">
        {nav}
        <Loader label="Loading the profile…" />
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="page">
        {nav}
        <ErrorMessage message={error} onRetry={reload} />
      </div>
    );
  }

  if (phase === "notfound") {
    return (
      <div className="page">
        {nav}
        <EmptyState
          title="No crew member with this ID"
          text="The profile may have been removed, or the link is wrong."
          actionLabel="See all crew"
          to="/crew"
        />
      </div>
    );
  }

  const details = [
    ["Department", member.department],
    ["Rank", <span key="rank" className="inline-rank"><RankPips rank={member.rank} />{member.rank}</span>],
    ["Specialty", member.specialty],
    ["Station module", member.module],
    ["Shift", member.shift],
    ["Origin", member.origin],
    ["Missions flown", member.missions],
    ["Joined", formatDate(member.joinedAt)],
  ];

  return (
    <div className="page">
      {nav}

      <article className="profile">
        <header className="profile-head">
          <Avatar name={member.name} department={member.department} size="lg" />
          <div>
            <h1>{member.name}</h1>
            <p className="muted">{member.description}</p>
          </div>
          <StatusBadge status={member.status} />
        </header>

        <dl className="details">
          {details.map(([label, value]) => (
            <div key={label} className="detail">
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <section className="actions" aria-label="Actions">
          <h2>Change status</h2>
          <div className="segmented" role="group" aria-label="Status">
            {STATUSES.map((status) => (
              <button
                key={status}
                type="button"
                className={status === member.status ? "seg seg-on" : "seg"}
                aria-pressed={status === member.status}
                disabled={busy}
                onClick={() => changeStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>

          {actionError && (
            <p className="notice notice-error" role="alert">
              {actionError}
            </p>
          )}

          <div className="actions-row">
            <Link to={`/crew/${member.id}/edit`} state={location.state} className="btn btn-ghost">
              Edit details
            </Link>
            <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={busy}>
              Remove from registry
            </button>
          </div>
        </section>
      </article>
    </div>
  );
}

