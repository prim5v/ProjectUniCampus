import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useEffect,
} from "react";

import {
  useUser,
  useAuth as useClerkAuth,
} from "@clerk/clerk-react";

import { useApi } from "./ApiContext";

export const AUTH = {
  IDLE: "idle",
  LOADING: "loading",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
  OTP_REQUIRED: "otp_required",
  MPESA: "mpesa",
  CONSENT_REQUIRED: "consent_required",
  ACCOUNT_CREATION: "account_creation",
} as const;

export type AuthStatus =
  (typeof AUTH)[keyof typeof AUTH];

interface DbUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

interface AuthSyncResponse {
  found: boolean;
  message?: string;
  user?: DbUser | null;
}

interface AuthContextType {
  status: AuthStatus;

  setStatus: React.Dispatch<
    React.SetStateAction<AuthStatus>
  >;

  dbUser: DbUser | null;

  loading: boolean;
  error: string | null;
  message: string | null;

  syncStatus:
    | "idle"
    | "loading"
    | "success"
    | "error";

  authSync: () => Promise<
    AuthSyncResponse
  >;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [status, setStatus] =
    useState<AuthStatus>(AUTH.IDLE);

  const [dbUser, setDbUser] =
    useState<DbUser | null>(null);

  const [syncStatus, setSyncStatus] =
    useState<
      "idle" | "loading" | "success" | "error"
    >("idle");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState<string | null>(null);

  const { user } = useUser();

  const { isSignedIn } = useClerkAuth();

  const { api } = useApi();

  /*
   * Sync Clerk user with our backend
   */
  const authSync = async (): Promise<AuthSyncResponse> => {
    if (!isSignedIn || !user) {
      throw new Error("User is not signed in");
    }

    try {
      setSyncStatus("loading");
      setLoading(true);
      setError(null);

      const response = await api.post<AuthSyncResponse>(
        "/auth/clerk/sync",
        {
          email:
            user.primaryEmailAddress
              ?.emailAddress,
        }
      );

      setMessage(
        response.data.message ?? null
      );

      setSyncStatus("success");
      setDbUser(response.data.user ?? null)

      return response.data;

    } catch (err) {
      console.error(
        "Auth sync failed:",
        err
      );

      setSyncStatus("error");

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Authentication sync failed";

      setError(errorMessage);

      throw err;

    } finally {
      setLoading(false);
    }
  };

  /*
   * Decide what happens after sync
   */
  useEffect(() => {
    if (!user?.id || !isSignedIn) {
      return;
    }

    const sync = async () => {
      try {
        const data = await authSync();

        if (data.found) {
          setStatus(
            AUTH.AUTHENTICATED
          );

          return;
        }

        setStatus(
          AUTH.ACCOUNT_CREATION
        );

      } catch (error) {
        console.error(
          "Auth sync failed:",
          error
        );
      }
    };

    sync();
  }, [user?.id, isSignedIn]);

  const value = useMemo(
    () => ({
      status,
      setStatus,

      dbUser,
      user,

      setDbUser,
      setLoading,

      loading,
      error,
      message,

      syncStatus,

      authSync,
    }),
    [
      status,
      dbUser,
      loading,
      error,
      message,
      syncStatus,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used inside AuthProvider"
    );
  }

  return context;
}