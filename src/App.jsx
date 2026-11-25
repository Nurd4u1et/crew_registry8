import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import CrewListPage from "./pages/CrewListPage";

const AboutPage = lazy(() => import("./pages/AboutPage"));
const CrewDetailsPage = lazy(() => import("./pages/CrewDetailsPage"));
const CrewFormPage = lazy(() => import("./pages/CrewFormPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const OfflinePage = lazy(() => import("./pages/OfflinePage"));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="offline" element={<OfflinePage />} />
        <Route path="crew">
          <Route index element={<CrewListPage />} />
          <Route path="new" element={<CrewFormPage />} />
          <Route path=":id" element={<CrewDetailsPage />} />
          <Route path=":id/edit" element={<CrewFormPage />} />
        </Route>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

