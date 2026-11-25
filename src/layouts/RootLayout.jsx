import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import { Loader } from "../components/StatusMessages";
import PwaStatus from "../components/PwaStatus";

export default function RootLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <NavBar />
      <PwaStatus />
      <main className="main">
        <Suspense fallback={<Loader label="Loading page…" />}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="footer">
        <p>Crew Registry · demo data stored in this browser</p>
      </footer>
    </>
  );
}

