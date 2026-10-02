import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import NotificationsPage from "../pages/NotificationsPage";
import OnboardingPage from "../pages/OnboardingPage";
import ChatPage from "../pages/ChatPage";
import CallPage from "../pages/CallPage";
import AppLayout from "./AppLayout";

function AppRoutes({ user, isAuthenticated }) {
  const ProtectedRoute = ({ isAuthenticated }) => {
    return isAuthenticated ? <Outlet /> : <Navigate replace to="/login" />;
  };

  const OnboardedRoute = ({ user }) => {
    return user?.isOnboarded ? (
      <Outlet />
    ) : (
      <Navigate replace to="/onboarding" />
    );
  };

  const PublicRoute = ({ isAuthenticated }) => {
    return isAuthenticated ? <Navigate replace to="/" /> : <Outlet />;
  };

  return (
    <Routes>
      <Route element={<AppLayout isAuthenticated={isAuthenticated} user={user} />}>
        {/* Public routes */}
        <Route element={<PublicRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>

        {/* Authenticated routes */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          {/* Onboarding route */}
          <Route
            path="/onboarding"
            element={
              user?.isOnboarded ? (
                <Navigate replace to="/" />
              ) : (
                <OnboardingPage user={user} />
              )
            }
          />

          {/* Routes requiring completed onboarding */}
          <Route element={<OnboardedRoute user={user} />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/call" element={<CallPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate replace to="/" />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
