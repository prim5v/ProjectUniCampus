import { createContext, useContext, useMemo } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

const ApiContext = createContext(null);

const API_URL = "https://projectunicampus.onrender.com";

export const ApiProvider = ({ children }) => {

    const api = useMemo(() => {

        const instance = axios.create({
            baseURL: API_URL,
            timeout: 15000,
        });

        // =========================================================
        // REQUEST INTERCEPTOR
        // =========================================================

        instance.interceptors.request.use(
            async (config) => {

                try {
                    // Only retrieve the SERVER access token here.
                    // localAccessToken must NEVER be sent to Flask.
                    const accessToken =
                        await SecureStore.getItemAsync("access_token");

                    if (accessToken) {
                        config.headers.Authorization =
                            `Bearer ${accessToken}`;
                    }

                } catch (error) {
                    console.log(
                        "[API] Failed to retrieve access token:",
                        error
                    );
                }

                return config;
            },

            (error) => {
                return Promise.reject(error);
            }
        );

        // =========================================================
        // RESPONSE INTERCEPTOR
        // =========================================================

        instance.interceptors.response.use(

            (response) => {
                return response;
            },

            async (error) => {

                const status = error?.response?.status;

                if (status === 401) {

                    console.log(
                        "[API] Server rejected access token."
                    );

                    /*
                     * DO NOT immediately navigate here.
                     *
                     * AuthContext is responsible for deciding whether
                     * the user should:
                     *
                     * 1. refresh the access token
                     * 2. enter offline mode
                     * 3. log out
                     */

                    try {
                        await SecureStore.deleteItemAsync(
                            "access_token"
                        );
                    } catch (storageError) {
                        console.log(
                            "[API] Failed to remove access token:",
                            storageError
                        );
                    }

                    /*
                     * We intentionally don't call router.replace()
                     * here because the API layer shouldn't own
                     * authentication state/navigation.
                     */
                }

                return Promise.reject(error);
            }
        );

        return instance;

    }, []);

    return (
        <ApiContext.Provider value={{ api }}>
            {children}
        </ApiContext.Provider>
    );
};

export const useApi = () => {
    const context = useContext(ApiContext);

    if (!context) {
        throw new Error(
            "useApi must be used inside ApiProvider"
        );
    }

    return context;
};