import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import axios, { type AxiosInstance } from "axios";
import { useAuth } from "@clerk/clerk-react";

interface ApiContextType {
  api: AxiosInstance;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

export function ApiProvider({ children }: ApiProviderProps) {
  const { getToken, signOut } = useAuth();

  // Create the Axios instance only once
  const api = useMemo(
    () =>
      axios.create({
        baseURL: "https://backend.onrender.com",
      }),
    []
  );

  useEffect(() => {
    // Request interceptor
    const requestInterceptor = api.interceptors.request.use(
      async (config) => {
        const token = await getToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      }
    );

    // Response interceptor
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,

      async (error) => {
        const status = error?.response?.status;

        if (status === 401) {
          alert("Your session has expired. Please log in again.");

          try {
            await signOut();
          } catch (err) {
            console.error("Sign out failed:", err);
          }

          window.location.href = "/login";
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [api, getToken, signOut]);

  return (
    <ApiContext.Provider value={{ api }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi(): ApiContextType {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }

  return context;
}