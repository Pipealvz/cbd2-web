// PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthProvider";

export default function PublicRoute({ children }) {
  const { auth } = useAuth();

  if (auth) {
    return <Navigate to="/" replace />;
  }

  return children;
}