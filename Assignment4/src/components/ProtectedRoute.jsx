import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const { token } = useSelector((s) => s.auth);
  return token ? children : <Navigate to="/login" replace />;
}

export function AdminRoute({ children }) {
  const { token, user } = useSelector((s) => s.auth);
  if (!token) return <Navigate to="/login" replace />;
  if (!user?.admin) return <Navigate to="/" replace />;
  return children;
}
