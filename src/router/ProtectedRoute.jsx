import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { loading, isAuthenticated, isEmailVerified } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div
          role="status"
          aria-label="Loading"
          className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"
        />
      </div>
    );
  }

  // Not logged in -> redirect to /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in with password but email not verified -> redirect to /verify-email
  if (!isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;