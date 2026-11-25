import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EmptyState, ErrorMessage, Loader } from "../components/StatusMessages";
import { DEPARTMENTS, MODULES, ORIGINS, RANKS, SHIFTS, STATUSES } from "../constants";
import useCrewMember from "../hooks/useCrewMember";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useAddCrewMember, useEditCrewMember } from "../hooks/useCrewMutations";

const today = () => new Date().toISOString().slice(0, 10);

const EMPTY = {
  name: "",
  description: "",
  department: DEPARTMENTS[0],
  rank: RANKS[0],
  status: STATUSES[0],
  module: MODULES[0],
  shift: SHIFTS[0],
  origin: ORIGINS[0],
  specialty: "",
  missions: "0",
  joinedAt: today(),
};

function Select({ label, name, value, options, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select name={name} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function CrewForm({ initial, onSubmit, submitLabel, cancelTo }) {
  const [values, setValues] = useState(() => ({ ...initial, missions: String(initial.missions) }));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const next = {};
    if (!values.name.trim()) next.name = "Enter a name.";
    if (!values.description.trim()) next.description = "Add a short description.";
    if (!values.specialty.trim()) next.specialty = "Enter a specialty.";
    const missions = Number(values.missions);
    if (values.missions === "" || !Number.isInteger(missions) || missions < 0) {
      next.missions = "Enter a whole number, 0 or more.";
    }
    if (!values.joinedAt) next.joinedAt = "Pick a date.";
    return next;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    setSubmitError("");
    try {
      await onSubmit({
        ...values,
        name: values.name.trim(),
        description: values.description.trim(),
        specialty: values.specialty.trim(),
        missions: Number(values.missions),
      });
    } catch (err) {
      setSubmitError(`Nothing was saved: ${err.message}`);
      setSaving(false);
    }
  }

  return (
    <form className="form form-wide" onSubmit={handleSubmit} noValidate>
      <label className="field">
        <span>Name</span>
        <input name="name" value={values.name} onChange={handleChange} aria-invalid={Boolean(errors.name)} />
        {errors.name && <small className="field-error">{errors.name}</small>}
      </label>

      <label className="field">
        <span>Description</span>
        <textarea
          name="description"
          rows="3"
          value={values.description}
          onChange={handleChange}
          aria-invalid={Boolean(errors.description)}
        />
        {errors.description && <small className="field-error">{errors.description}</small>}
      </label>

      <div className="form-grid">
        <Select label="Department" name="department" value={values.department} options={DEPARTMENTS} onChange={handleChange} />
        <Select label="Rank" name="rank" value={values.rank} options={RANKS} onChange={handleChange} />
        <Select label="Status" name="status" value={values.status} options={STATUSES} onChange={handleChange} />
        <Select label="Station module" name="module" value={values.module} options={MODULES} onChange={handleChange} />
        <Select label="Shift" name="shift" value={values.shift} options={SHIFTS} onChange={handleChange} />
        <Select label="Origin" name="origin" value={values.origin} options={ORIGINS} onChange={handleChange} />

        <label className="field">
          <span>Specialty</span>
          <input name="specialty" value={values.specialty} onChange={handleChange} aria-invalid={Boolean(errors.specialty)} />
          {errors.specialty && <small className="field-error">{errors.specialty}</small>}
        </label>

        <label className="field">
          <span>Missions flown</span>
          <input
            name="missions"
            type="number"
            min="0"
            step="1"
            value={values.missions}
            onChange={handleChange}
            aria-invalid={Boolean(errors.missions)}
          />
          {errors.missions && <small className="field-error">{errors.missions}</small>}
        </label>

        <label className="field">
          <span>Joined</span>
          <input name="joinedAt" type="date" value={values.joinedAt} onChange={handleChange} aria-invalid={Boolean(errors.joinedAt)} />
          {errors.joinedAt && <small className="field-error">{errors.joinedAt}</small>}
        </label>
      </div>

      {submitError && (
        <p className="notice notice-error" role="alert">
          {submitError}
        </p>
      )}

      <div className="actions-row">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : submitLabel}
        </button>
        <Link to={cancelTo} className="btn btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}

export default function CrewFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id !== undefined;
  const addMutation = useAddCrewMember();
  const editMutation = useEditCrewMember();

  const validId = isEdit && /^\d+$/.test(id);
  const { phase, member, error, reload } = useCrewMember(isEdit ? (validId ? id : null) : undefined);

  useDocumentTitle(isEdit ? "Edit crew member" : "Add crew member");

  if (!isEdit) {
    return (
      <div className="page page-narrow">
        <h1>Add crew member</h1>
        <CrewForm
          initial={EMPTY}
          submitLabel="Add to registry"
          cancelTo="/crew"
          onSubmit={async (data) => {
            const created = await addMutation.mutateAsync(data);
            navigate(`/crew/${created.id}`, { replace: true });
          }}
        />
      </div>
    );
  }

  if (phase === "loading") return <div className="page"><Loader label="Loading the profile…" /></div>;
  if (phase === "error") return <div className="page"><ErrorMessage message={error} onRetry={reload} /></div>;
  if (phase === "notfound") {
    return (
      <div className="page">
        <EmptyState
          title="No crew member with this ID"
          text="There is nothing to edit here."
          actionLabel="See all crew"
          to="/crew"
        />
      </div>
    );
  }

  return (
    <div className="page page-narrow">
      <h1>Edit {member.name}</h1>
      <CrewForm
        key={member.id}
        initial={member}
        submitLabel="Save changes"
        cancelTo={`/crew/${member.id}`}
        onSubmit={async (data) => {
          await editMutation.mutateAsync({ id: member.id, changes: data });
          navigate(`/crew/${member.id}`, { replace: true });
        }}
      />
    </div>
  );
}

