import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import CrewCard from "../components/CrewCard";
import Pagination from "../components/Pagination";
import { EmptyState, ErrorMessage, Loader } from "../components/StatusMessages";
import { DEPARTMENTS, RANKS, SORT_OPTIONS, STATUSES } from "../constants";
import useCrewList from "../hooks/useCrewList";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { buildListQuery } from "../services/service";

const PAGE_SIZE = 12;

export default function CrewListPage() {
  useDocumentTitle("Crew");

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const [searchDraft, setSearchDraft] = useState(search);
  const department = searchParams.get("department") ?? "";
  const status = searchParams.get("status") ?? "";
  const rank = searchParams.get("rank") ?? "";
  const sort = searchParams.get("sort") ?? "name";
  const page = Math.max(1, parseInt(searchParams.get("page"), 10) || 1);

  const query = buildListQuery({ search, department, status, rank, sort, page, limit: PAGE_SIZE });
  const { phase, data, error, reload } = useCrewList(query);

  useEffect(() => setSearchDraft(search), [search]);

  useEffect(() => {
    if (searchDraft === search) return undefined;
    const timer = window.setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (searchDraft) next.set("search", searchDraft);
        else next.delete("search");
        next.delete("page");
        return next;
      }, { replace: true });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchDraft, search, setSearchParams]);

  const hasFilters = Boolean(search || department || status || rank || searchParams.get("sort"));

  function update(changes, { replace = false } = {}) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(changes).forEach(([key, value]) => {
          if (value) next.set(key, value);
          else next.delete(key);
        });
        if (!("page" in changes)) next.delete("page");
        return next;
      },
      { replace },
    );
  }

  function clearFilters() {
    setSearchParams({});
  }

  useEffect(() => {
    if (phase === "success" && data.totalPages > 0 && page > data.totalPages) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("page", String(data.totalPages));
          return next;
        },
        { replace: true },
      );
    }
  }, [phase, data, page, setSearchParams]);

  const refreshing = phase === "loading" && data !== null;
  const first = data ? (data.page - 1) * data.limit + 1 : 0;
  const last = data ? Math.min(data.page * data.limit, data.total) : 0;

  let content;
  if (phase === "error") {
    content = <ErrorMessage message={error} onRetry={reload} />;
  } else if (!data) {
    content = <Loader label="Loading the crew…" />;
  } else if (data.data.length === 0) {
    content = (
      <EmptyState
        title="No one matches these filters"
        text="Try a different search or remove a filter."
        actionLabel="Clear filters"
        onAction={clearFilters}
      />
    );
  } else {
    content = (
      <>
        <ul className={refreshing ? "grid is-refreshing" : "grid"}>
          {data.data.map((member) => (
            <li key={member.id}>
              <CrewCard member={member} />
            </li>
          ))}
        </ul>
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          disabled={refreshing}
          onChange={(next) => update({ page: next > 1 ? String(next) : "" })}
        />
      </>
    );
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Crew</h1>
        <Link to="/crew/new" className="btn btn-primary">
          Add crew member
        </Link>
      </div>

      <form className="filters" role="search" onSubmit={(event) => event.preventDefault()}>
        <label className="field field-search">
          <span>Search</span>
          <input
            type="search"
            value={searchDraft}
            placeholder="Name, specialty or description"
            onChange={(event) => setSearchDraft(event.target.value)}
          />
        </label>

        <label className="field">
          <span>Department</span>
          <select value={department} onChange={(event) => update({ department: event.target.value })}>
            <option value="">All departments</option>
            {DEPARTMENTS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Status</span>
          <select value={status} onChange={(event) => update({ status: event.target.value })}>
            <option value="">Any status</option>
            {STATUSES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Rank</span>
          <select value={rank} onChange={(event) => update({ rank: event.target.value })}>
            <option value="">Any rank</option>
            {RANKS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Sort by</span>
          <select
            value={sort}
            onChange={(event) => update({ sort: event.target.value === "name" ? "" : event.target.value })}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </form>

      <div className="result-bar" aria-live="polite">
        <p>
          {phase === "error"
            ? ""
            : refreshing
              ? "Updating…"
              : data && data.total > 0
                ? `Showing ${first}–${last} of ${data.total}`
                : ""}
        </p>
        {hasFilters && (
          <button type="button" className="link-btn" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      {content}
    </div>
  );
}

