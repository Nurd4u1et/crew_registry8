import { Link } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function HomePage() {
  useDocumentTitle("");

  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Everyone aboard the station, in one place</h1>
        <p className="lead">
          Crew Registry keeps track of who is on the station, what they do, where they are
          stationed and whether they are on shift. Search the roster, open a profile or check
          how the crew is doing today.
        </p>
        <div className="hero-actions">
          <Link to="/crew" className="btn btn-primary">
            Browse the crew
          </Link>
          <Link to="/dashboard" className="btn btn-ghost">
            Open the dashboard
          </Link>
        </div>
        <p className="hero-more">
          New here? Read <Link to="/about">about the project</Link> or{" "}
          <Link to="/login">log in</Link>.
        </p>
      </div>
      <img
        className="hero-image"
        src="/station.svg"
        alt="A ring-shaped space station orbiting a blue planet"
        width="640"
        height="520"
      />
    </section>
  );
}

