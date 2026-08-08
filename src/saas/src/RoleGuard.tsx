// import { ReactNode } from "react";
// import { Navigate } from "react-router-dom";
// import { useAuthContext } from "./contexts/AuthContext";

// interface RoleGuardProps {
//   children: ReactNode;
//   allowedRoles: string[];
// }

// export function RoleGuard({
//   children,
//   allowedRoles,
// }: RoleGuardProps): JSX.Element {
//   const { dbUser, loading } = useAuthContext();

//   // Wait until the auth state has finished loading
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // User isn't authenticated
//   if (!dbUser) {
//     return <Navigate to="/login" replace />;
//   }

//   // User doesn't have permission
//   if (!allowedRoles.includes(dbUser.role)) {
//     return <Navigate to="/" replace />;
//   }

//   return <>{children}</>;
// }

import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "./contexts/AuthContext";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

export function RoleGuard({
  children,
  allowedRoles,
}: RoleGuardProps): JSX.Element {
  const { dbUser, loading } = useAuthContext();

  // Wait until authentication has finished loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // User isn't authenticated
  if (!dbUser) {
    return <Navigate to="/signin" replace />;
  }

  // Supports both:
  // "admin" -> "admin"
  // "sdhhd_admin" -> "admin"
  const role = dbUser.role
    ?.trim()
    .toLowerCase()
    .endsWith("_admin")
    ? "admin"
    : dbUser.role?.trim().toLowerCase();

  // User doesn't have permission
  const hasPermission = allowedRoles.some(
    (allowedRole) =>
      allowedRole.trim().toLowerCase() === role
  );

  if (!role || !hasPermission) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}