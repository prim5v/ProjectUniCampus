import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

export function RoleGuard({
  children,
  allowedRoles,
}: RoleGuardProps): JSX.Element {
  const { dbUser, loading } = useAuth();

  // Wait until the auth state has finished loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // User isn't authenticated
  if (!dbUser) {
    return <Navigate to="/login" replace />;
  }

  // User doesn't have permission
  if (!allowedRoles.includes(dbUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}