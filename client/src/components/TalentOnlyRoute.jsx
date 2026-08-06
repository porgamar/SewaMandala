import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function TalentOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-page">
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  if (!user || user.user_type !== "talent") {
    return <Navigate to="/" replace />;
  }

  return children;
}