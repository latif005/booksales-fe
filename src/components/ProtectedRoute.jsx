import { Navigate } from "react-router-dom";
import {
  isAuthenticated,
  getUserRole
} from "../_services/auth";

export default function ProtectedRoute({ children, role }) {
  // Mengecek apakah user sudah login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const userRole = getUserRole();

  // Mengecek hak akses berdasarkan role
  if (role && userRole !== role) {
    return <Navigate to={userRole === "admin" ? "/admin" : "/"} replace />;
  }

  return children;
}