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

  // Convert "Zetech University_admin" -> "admin"
  const role = dbUser.role
    ?.split("_")
    .pop()
    ?.toLowerCase();

  // User doesn't have permission
  if (
    !role ||
    !allowedRoles
      .map((allowedRole) =>
        allowedRole.toLowerCase()
      )
      .includes(role)
  ) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}