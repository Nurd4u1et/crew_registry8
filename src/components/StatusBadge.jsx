const TONES = {
  "On duty": "ok",
  "Off duty": "idle",
  "On mission": "mission",
  "On leave": "warn",
};

export default function StatusBadge({ status }) {
  return <span className={`badge badge-${TONES[status] ?? "idle"}`}>{status}</span>;
}

