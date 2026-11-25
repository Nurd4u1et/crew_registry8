import { Link } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";

const ROUTES = [
  ["/", "Home"],
  ["/about", "About"],
  ["/crew", "Crew list with search, filters, sorting and pagination"],
  ["/crew/:id", "Crew member details"],
  ["/dashboard", "Statistics and breakdowns"],
  ["/login", "Log in with email or Google"],
  ["/signup", "Create an account"],
  ["/profile", "Your account (requires login)"],
  ["*", "Not found"],
];

export default function AboutPage() {
  useDocumentTitle("About");

  return (
    <div className="page page-narrow">
      <h1>About the project</h1>
      <p className="lead">
        Crew Registry is a single-page React app for managing the crew of an orbital station. It
        was built to practice routing, server-data caching and Firebase authentication.
      </p>

      <h2>What you can do</h2>
      <p>
        Search the roster by name or specialty, narrow it down by department, status and rank,
        sort it and move between pages. Every filter lives in the address bar, so a filtered view
        can be copied, bookmarked or reloaded. Open a profile to change someone’s status, edit
        their details or remove them. The dashboard turns the same data into statistics.
      </p>

      <h2>How it is built</h2>
      <p>
        Pages sit in <code>pages/</code>, reusable pieces in <code>components/</code>, data
        loading in <code>hooks/</code> and every request in <code>services/service.js</code>. The
        data comes from a fake API that behaves like a server: it answers after a random delay and
        sometimes fails, so loading and error states are part of the design. Records are kept in
        this browser’s local storage.
      </p>

      <h2>Pages</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Path</th>
            <th scope="col">Page</th>
          </tr>
        </thead>
        <tbody>
          {ROUTES.map(([path, label]) => (
            <tr key={path}>
              <td>
                <code>{path}</code>
              </td>
              <td>{label}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        <Link to="/crew" className="btn btn-primary">
          Browse the crew
        </Link>
      </p>
    </div>
  );
}

