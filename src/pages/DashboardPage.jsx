import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { EmptyState, ErrorMessage, Loader } from "../components/StatusMessages";
import { DEPARTMENTS } from "../constants";
import useAllCrew from "../hooks/useAllCrew";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { selectDashboardStats } from "../store/selectors";

function Breakdown({ title, rows, total, field, department }) {
  return (
    <section className="panel" aria-label={title}>
      <h2>{title}</h2>
      <ul className="bars">
        {rows.map((row) => {
          const share = total > 0 ? (row.count / total) * 100 : 0;
          const params = new URLSearchParams({ [field]: row.label });
          if (department) params.set("department", department);

          return (
            <li key={row.label}>
              <Link to={`/crew?${params.toString()}`} className="bar-row">
                <span className="bar-label">{row.label}</span>
                <span className="bar-track">
                  <span className="bar-fill" style={{ width: `${share}%` }} />
                </span>
                <span className="bar-count">{row.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function DashboardPage() {
  useDocumentTitle("Dashboard");

  const { phase, error, reload } = useAllCrew();
  const [searchParams, setSearchParams] = useSearchParams();
  const department = searchParams.get("department") ?? "";

  function changeDepartment(value) {
    setSearchParams(value ? { department: value } : {});
  }

  const stats = useSelector((state) => selectDashboardStats(state, department));

  let content;
  if (phase === "error") {
    content = <ErrorMessage message={error} onRetry={reload} />;
  } else if (phase === "loading") {
    content = <Loader label="Counting the crew…" />;
  } else if (stats.total === 0) {
    content = (
      <EmptyState
        title="No one in this department"
        text="Pick another department to see statistics."
        actionLabel="Show all departments"
        onAction={() => changeDepartment("")}
      />
    );
  } else {
    content = (
      <>
        <dl className="stats">
          <div className="stat">
            <dt>Crew members</dt>
            <dd>{stats.total}</dd>
          </div>
          <div className="stat">
            <dt>On duty now</dt>
            <dd>{stats.onDuty}</dd>
          </div>
          <div className="stat">
            <dt>Missions flown</dt>
            <dd>{stats.totalMissions}</dd>
          </div>
          <div className="stat">
            <dt>Missions per person</dt>
            <dd>{stats.averageMissions.toFixed(1)}</dd>
          </div>
          <div className="stat">
            <dt>Officers and commanders</dt>
            <dd>{stats.seniorShare}%</dd>
          </div>
        </dl>

        <div className="breakdowns">
          <Breakdown title="By status" rows={stats.byStatus} total={stats.total} field="status" department={department} />
          <Breakdown title="By rank" rows={stats.byRank} total={stats.total} field="rank" department={department} />
          <Breakdown title="By station module" rows={stats.byModule} total={stats.total} field="module" department={department} />
        </div>

        <section className="panel" aria-label="Most experienced">
          <h2>Most missions flown</h2>
          <ol className="top-list">
            {stats.topMissions.map((member) => (
              <li key={member.id}>
                <Link to={`/crew/${member.id}`}>{member.name}</Link>
                <span className="muted">
                  {member.rank}, {member.department}
                </span>
                <strong>{member.missions}</strong>
              </li>
            ))}
          </ol>
          <p>
            <Link to={department ? `/crew?department=${encodeURIComponent(department)}` : "/crew"}>
              See the full roster
            </Link>
          </p>
        </section>
      </>
    );
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Dashboard</h1>
        <label className="field field-inline">
          <span>Department</span>
          <select value={department} onChange={(event) => changeDepartment(event.target.value)}>
            <option value="">All departments</option>
            {DEPARTMENTS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      {content}
    </div>
  );
}

