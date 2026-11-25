import { Link } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function NotFoundPage() {
  useDocumentTitle("Page not found");

  return (
    <div className="page page-narrow not-found">
      <p className="not-found-code" aria-hidden="true">
        404
      </p>
      <h1>This page doesn’t exist</h1>
      <p className="lead">The address may be misspelled, or the page was moved.</p>
      <p>
        <Link to="/" className="btn btn-primary">
          Go to the home page
        </Link>{" "}
        <Link to="/crew" className="btn btn-ghost">
          See the crew
        </Link>
      </p>
    </div>
  );
}

