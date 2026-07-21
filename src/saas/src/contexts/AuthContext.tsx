import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
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
} as const;


export type AuthStatus =
  (typeof AUTH)[keyof typeof AUTH];


interface DbUser {
  id: string;
  email: string;
  role: string;
  name?: string;
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

  syncStatus: "idle" | "loading" | "success" | "error";

  authSync: () => Promise<void>;
}


const AuthContext =
  createContext<AuthContextType | undefined>(undefined);



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

  const {
    isSignedIn,
  } = useClerkAuth();


  const { api } = useApi();



  const authSync = async () => {

    if (!isSignedIn || !user) {
      return;
    }


    try {

      setSyncStatus("loading");
      setLoading(true);
      setError(null);


      const response = await api.post(
        "/auth/clerk/sync",
        {
          email:
            user.primaryEmailAddress
              ?.emailAddress,
        }
      );


      setDbUser(response.data.user);

      setMessage(
        response.data.message
      );

      setSyncStatus("success");


      setStatus(
        AUTH.AUTHENTICATED
      );


    } catch (err) {

      console.error(
        "Auth sync failed:",
        err
      );


      setSyncStatus("error");


      setError(
        err instanceof Error
          ? err.message
          : "Authentication sync failed"
      );


    } finally {

      setLoading(false);

    }

  };



  const value = useMemo(
    () => ({
      status,
      setStatus,

      dbUser,

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