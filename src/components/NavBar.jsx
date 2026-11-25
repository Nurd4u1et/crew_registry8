import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/crew", label: "Crew" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/about", label: "About" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const { user, loading, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={close}>
          <svg viewBox="0 0 64 64" width="28" height="28" aria-hidden="true">
            <rect width="64" height="64" rx="12" fill="#0f1f3d" />
            <ellipse
              cx="32"
              cy="32"
              rx="22"
              ry="9"
              fill="none"
              stroke="#7fa4ff"
              strokeWidth="4"
              transform="rotate(-20 32 32)"
            />
            <circle cx="32" cy="32" r="6" fill="#fff" />
          </svg>
          Crew Registry
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>

        <nav id="main-nav" className={open ? "nav nav-open" : "nav"} aria-label="Main">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={close}
              className={({ isActive }) => (isActive ? "nav-link nav-link-active" : "nav-link")}
            >
              {link.label}
            </NavLink>
          ))}
          {!loading &&
            (user ? (
              <>
                <NavLink
                  to="/profile"
                  onClick={close}
                  className={({ isActive }) => (isActive ? "nav-link nav-link-active" : "nav-link")}
                >
                  Profile
                </NavLink>
                <button
                  type="button"
                  className="btn btn-ghost nav-login"
                  onClick={() => {
                    close();
                    logout();
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={close} className="btn btn-ghost nav-login">
                  Login
                </NavLink>
                <NavLink to="/signup" onClick={close} className="btn btn-primary nav-login">
                  Signup
                </NavLink>
              </>
            ))}
        </nav>
      </div>
    </header>
  );
}

