import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";

import { jwtDecode } from "jwt-decode";

import { useApi } from "./ApiContext";
import { useBiometric } from "./BiometricContext";
import { Alert } from 'react-native';

const AuthContext = createContext(null);

const API_URL = "https://projectunicampus.onrender.com";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const LOCAL_ACCESS_TOKEN_KEY = "local_access_token";

const USER_KEY = "auth_user";
const DEVICE_ID_KEY = "device_id";
const IS_LOGGED_IN_KEY = "is_logged_in";


// ================================================================
// AUTH PROVIDER
// ================================================================

export const AuthProvider = ({ children }) => {

    const { api } = useApi();
    const { authenticate, isAuthenticated } = useBiometric();

    // ============================================================
    // STATE
    // ============================================================

    const [user, setUser] = useState(null);

    const [refreshToken, setRefreshToken] = useState(null);

    /*
     * SERVER JWT
     */
    const [accessToken, setAccessToken] = useState(null);

    /*
     * OFFLINE TOKEN
     *
     * Completely separate from the server JWT.
     */
    const [localAccessToken, setLocalAccessToken] = useState(null);

    const [deviceId, setDeviceId] = useState(null);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [authStatus, setAuthStatus] = useState(false);

    const [isOnline, setIsOnline] = useState(false);

    const [authReady, setAuthReady] = useState(false);

    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(true);


    // ============================================================
    // RESTORE AUTHENTICATION FROM STORAGE
    // ============================================================

    useEffect(() => {

        const restoreAuth = async () => {

            try {

                console.log("[Auth] Restoring authentication...");

                const [
                    storedUser,
                    storedRefreshToken,
                    storedAccessToken,
                    storedLocalAccessToken,
                    storedDeviceId,
                    storedIsLoggedIn,
                ] = await Promise.all([

                    AsyncStorage.getItem(USER_KEY),

                    SecureStore.getItemAsync(
                        REFRESH_TOKEN_KEY
                    ),

                    SecureStore.getItemAsync(
                        ACCESS_TOKEN_KEY
                    ),

                    SecureStore.getItemAsync(
                        LOCAL_ACCESS_TOKEN_KEY
                    ),

                    AsyncStorage.getItem(
                        DEVICE_ID_KEY
                    ),

                    AsyncStorage.getItem(
                        IS_LOGGED_IN_KEY
                    ),
                ]);

                // let storedRefreshToken = null;

                // if (authStatus === true) {
                //     storedRefreshToken =
                //         await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
                // }


                // USER

                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }


                // REFRESH TOKEN

                if (storedRefreshToken) {
                    setRefreshToken(
                        JSON.parse(storedRefreshToken)
                    );
                }


                // SERVER ACCESS TOKEN

                if (storedAccessToken) {
                    setAccessToken(
                        storedAccessToken
                    );
                }


                // LOCAL ACCESS TOKEN

                if (storedLocalAccessToken) {
                    setLocalAccessToken(
                        JSON.parse(storedLocalAccessToken)
                    );
                }


                // DEVICE ID

                if (storedDeviceId) {
                    setDeviceId(
                        JSON.parse(storedDeviceId)
                    );
                }


                // LOGIN STATE

                if (storedIsLoggedIn) {
                    setIsLoggedIn(
                        JSON.parse(storedIsLoggedIn)
                    );
                }

                //authenticate
                console.log("[Auth] authStatus before biometric:", authStatus);
                console.log("[Auth] isLoggedIn before biometric:", isLoggedIn);
                // this doesnt run sinse isLogged in is false,
                if (authStatus === false&& isLoggedIn === true) {

                    console.log("[Auth] Starting biometric authentication...");

                    const result = await authenticate();

                    console.log("[Auth] Biometric result:", result);

                    if (result.success) {

                        console.log("[Auth] Biometric authentication SUCCESS");

                        setAuthStatus(true);
                        setLoading(false);

                    } else {

                        console.log(
                            "[Auth] Biometric authentication FAILED:",
                            result
                        );

                        setAuthStatus(false);
                        setLoading(true);
                    }
                }

            } catch (error) {

                console.error(
                    "[Auth] Failed to restore authentication:",
                    error
                );

                setError(error);

            } finally {

                setAuthReady(true);

                console.log(
                    "[Auth] Authentication restoration complete."
                );
            }
        };


        restoreAuth();

    }, []);




        useEffect(() => {

            if (!authReady) {
                return;
            }
            // if(authStatus === true && isLoggedIn === true){

            initializeAuthentication();
            // }

        }, [
            authReady,
            authStatus,
            isLoggedIn,
        ]);


    // ============================================================
    // PERSIST USER
    // ============================================================

    useEffect(() => {

        const saveUser = async () => {

            if (user) {

                await AsyncStorage.setItem(
                    USER_KEY,
                    JSON.stringify(user)
                );

            } else {

                await AsyncStorage.removeItem(
                    USER_KEY
                );
            }
        };

        saveUser();

    }, [user]);


    // ============================================================
    // PERSIST REFRESH TOKEN
    // ============================================================

    useEffect(() => {

        const saveRefreshToken = async () => {

            if (refreshToken) {

                await SecureStore.setItemAsync(
                    REFRESH_TOKEN_KEY,
                    JSON.stringify(refreshToken)
                );

            } else {

                await SecureStore.deleteItemAsync(
                    REFRESH_TOKEN_KEY
                );
            }
        };

        saveRefreshToken();

    }, [refreshToken]);


    // ============================================================
    // PERSIST ACCESS TOKEN
    // ============================================================

    useEffect(() => {

        const saveAccessToken = async () => {

            if (accessToken) {

                await SecureStore.setItemAsync(
                    ACCESS_TOKEN_KEY,
                    accessToken
                );

            } else {

                await SecureStore.deleteItemAsync(
                    ACCESS_TOKEN_KEY
                );
            }
        };

        saveAccessToken();

    }, [accessToken]);


    // ============================================================
    // PERSIST LOCAL ACCESS TOKEN
    // ============================================================

    useEffect(() => {

        const saveLocalAccessToken = async () => {

            if (localAccessToken) {

                await SecureStore.setItemAsync(
                    LOCAL_ACCESS_TOKEN_KEY,
                    JSON.stringify(localAccessToken)
                );

            } else {

                await SecureStore.deleteItemAsync(
                    LOCAL_ACCESS_TOKEN_KEY
                );
            }
        };

        saveLocalAccessToken();

    }, [localAccessToken]);


    // ============================================================
    // PERSIST DEVICE ID
    // ============================================================

    useEffect(() => {

        const saveDeviceId = async () => {

            if (deviceId) {

                await AsyncStorage.setItem(
                    DEVICE_ID_KEY,
                    JSON.stringify(deviceId)
                );

            } else {

                await AsyncStorage.removeItem(
                    DEVICE_ID_KEY
                );
            }
        };

        saveDeviceId();

    }, [deviceId]);


    // ============================================================
    // PERSIST LOGIN STATE
    // ============================================================

    useEffect(() => {

        const saveLoginState = async () => {

            await AsyncStorage.setItem(
                IS_LOGGED_IN_KEY,
                JSON.stringify(isLoggedIn)
            );
        };

        saveLoginState();

    }, [isLoggedIn]);


    useEffect(() => {

        if (isAuthenticated === true) {

            console.log(
                "[Auth] Biometric authenticated → authStatus = true"
            );

            setAuthStatus(true);
            // initializeAuthentication();
        }

    }, [isAuthenticated, authStatus]);

    //so get profile runs whether online / offline
    useEffect(() => {
        if(accessToken && authStatus === true && isLoggedIn === true){
            getProfile();
            console.log("[Auth] Access token exists, fetching profile...", user);
        }
    }, [getProfile, accessToken, authStatus, isLoggedIn]);






    // ============================================================
    // CHECK SERVER CONNECTIVITY
    // ============================================================

    const checkOnlineStatus = useCallback(
        async () => {

            try {

                console.log("[Auth] Checking internet connectivity...");

                const response = await fetch(
                    "https://www.google.com/generate_204",
                    {
                        method: "GET",
                    }
                );

                const online = response.status === 204;

                console.log(
                    "[Auth] Internet connectivity:",
                    response.status,
                    online
                );

                setIsOnline(online);

                return online;

            } catch (error) {

                console.error(
                    "[Auth] Internet connectivity check failed:",
                    error
                );

                setIsOnline(false);

                return false;
            }
        },
        []
    );


    // ============================================================
    // SERVER JWT EXPIRATION
    // ============================================================

    const checkAccessTokenExpired = useCallback(
        (token, bufferSeconds = 30) => {

            try {

                if (!token) {
                    return true;
                }

                const payload = jwtDecode(token);

                if (!payload.exp) {
                    return true;
                }

                const now =
                    Math.floor(Date.now() / 1000);

                return (
                    payload.exp <=
                    now + bufferSeconds
                );

            } catch (error) {

                console.log(
                    "[Auth] Invalid access token:",
                    error
                );

                return true;
            }
        },
        []
    );


    // ============================================================
    // LOCAL TOKEN EXPIRATION
    // ============================================================

    const checkLocalAccessTokenExpired =
        useCallback((localToken) => {

            if (!localToken) {
                return true;
            }

            if (!localToken.expiresAt) {
                return true;
            }

            const now =
                Math.floor(Date.now() / 1000);

            return (
                localToken.expiresAt <= now
            );

        }, []);


    // ============================================================
    // GENERATE OFFLINE ACCESS TOKEN
    // ============================================================

    const generateLocalAccessToken =
        useCallback(async () => {

            try {

                /*
                 * Cryptographically random UUID.
                 *
                 * This is NOT a backend JWT.
                 * It is only an offline application credential.
                 */

                const token =
                    Crypto.randomUUID();

                const now =
                    Math.floor(Date.now() / 1000);

                const localToken = {

                    token,

                    userId: user?.id ?? user?.student_id ?? null,

                    deviceId,

                    createdAt: now,


                    expiresAt:
                        now + (3 * 60),
                };


                setLocalAccessToken(
                    localToken
                );

                console.log(
                    "[Auth] Local access token generated."
                );

                return localToken;

            } catch (error) {

                console.error(
                    "[Auth] Failed to generate local token:",
                    error
                );

                setError(error);

                return null;
            }

        }, [user, deviceId]);


    // ============================================================
    // REFRESH SERVER ACCESS TOKEN
    // ============================================================

const logout = useCallback(async () => {
    Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    if (!refreshToken) {
                        console.log(
                            "[Auth] No refresh token available for logout."
                        );

                        setAuthStatus(false);
                        return;
                    }

                    try {
                        const response = await fetch(
                            `${API_URL}/auth/student/logout`,
                            {
                                method: "POST",
                                headers: {
                                    Authorization: `Bearer ${refreshToken}`,
                                },
                            }
                        );

                        setUser(null);
                        setAccessToken(null);
                        setRefreshToken(null);
                        setLocalAccessToken(null);
                        setDeviceId(null);
                        setIsLoggedIn(false);
                        setAuthStatus(false);
                        setError(null);

                        console.log("[Auth] Student logged out successfully.");

                    } catch (error) {
                        console.error(
                            "[Auth] Student logout failed:",
                            error
                        );
                    }
                },
            },
        ],
        {
            cancelable: true,
        }
    );
}, [refreshToken]);
        

    const refreshAccessToken =
        useCallback(async () => {

            if (!refreshToken) {

                console.log(
                    "[Auth] No refresh token available."
                );

                setAuthStatus(false);

                return null;
            }


            try {

                const response = await fetch(
                    `${API_URL}/auth/refresh/access/token`,
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                                `Bearer ${refreshToken}`,

                            "Content-Type":
                                "application/json",
                        },
                    }
                );


                const data =
                    await response.json();
                    console.log("[Auth] Refresh access token response:", data);


                if (!response.ok) {

                    throw new Error(
                        data?.error ||
                        "Failed to refresh access token."
                    );
                }


                const newAccessToken =
                    data.access_token;


                if (!newAccessToken) {

                    throw new Error(
                        "Server did not return access token."
                    );
                }


                setAccessToken(
                    newAccessToken
                );

                setAuthStatus(true);

                console.log(
                    "[Auth] Access token refreshed."
                );


                return newAccessToken;

            } catch (error) {

                console.error(
                    "[Auth] Access token refresh failed:",
                    error
                );

                setAccessToken(null);

                setAuthStatus(false);

                setError(error);

                return null;
            }

        }, [refreshToken]);


    // ============================================================
    // GET USER PROFILE
    // ============================================================

    const getProfile = useCallback(async () => {

        try {

            const response =
                await api.get(
                    "/student/get/profile"
                );


            const data =
                response.data;


            setUser(data);
            console.log("[Auth] User profile retrieved:", data);

            // setAuthStatus(true);

            /*
             * Since the user has successfully authenticated
             * online, make sure they have an offline credential.
             */

            // if (!localAccessToken) {

            //     await generateLocalAccessToken();
            // }


            return data;

        } catch (error) {

            console.error(
                "[Auth] Failed to get profile:",
                error
            );

            // setAuthStatus(false);

            throw error;
        }

    }, [
        api,
        accessToken,
        localAccessToken,
        generateLocalAccessToken,
    ]);


    // ============================================================
    // LOGIN
    // ============================================================

    const login = async (username, pwd) => {

        try {

            setError(null);


            const payload = {
                username,
                pwd,
            };


            const response =
                await api.post(
                    "/auth/student/login",
                    payload
                );


            const data =
                response.data;


            console.log(
                "[Auth] Login successful."
            );


            setRefreshToken(
                data.refresh_token
            );


            setDeviceId(
                data.device_id
            );


            setIsLoggedIn(true);


            /*
             * If backend also returns an access token,
             * store it.
             */

            if (data.access_token) {

                setAccessToken(
                    data.access_token
                );
            }


            /*
             * We don't generate the offline token until
             * the user's profile has successfully loaded.
             *
             * This gives us a confirmed authenticated identity.
             */

            return data;

        } catch (error) {

            console.error(
                "[Auth] Login failed:",
                error
            );

            setError(error);

            setAuthStatus(false);

            throw error;
        }
    };


    // ============================================================
    // INITIAL AUTH DECISION
    // ============================================================

    // useEffect(() => {

    //     if (!authReady) {
    //         return;
    //     }


        const initializeAuthentication = useCallback(
            async () => {

                /*
                 * First determine network availability.
                 */

                const online =
                    await checkOnlineStatus();


                // =================================================
                // ONLINE
                // =================================================

                if (online) {

                    console.log(
                        "[Auth] Online authentication."
                    );


                    /*
                     * We need a server access token.
                     */
                    // this runs if no available access token, but refresh token exists, and authStatus is true
                    if (!accessToken) {

                        // if (refreshToken && authStatus === true) {
                        console.log("authStatus before refresh token check:", authStatus);
                        if(refreshToken && authStatus === true){ //protect refresh token usage with authStatus check

                            console.log(
                                "[Auth] No access token, but refresh token exists. Attempting to refresh..."
                            );

                            const newToken =
                                await refreshAccessToken();

                            if (newToken) {

                                // await getProfile();
                                // setAuthStatus(true);

                            } else {

                                setAuthStatus(false);
                            }

                        } else {

                            setAuthStatus(false);
                        }

                        return;
                    }


                    /*
                     * Access token exists.
                     *
                     * Check whether it is expired.
                     */
                    // this runs if access token exists. returns true if expired.
                    if (
                        checkAccessTokenExpired(
                            accessToken
                        )
                    ) {

                        console.log(
                            "[Auth] Access token expired."
                        );

                        if(authStatus === true){ //protect refresh token usage with authStatus check
                        const newToken = await refreshAccessToken();
                        return;
                    }
                    }else{
                        console.log("[Auth] Access token is valid.");
                        setAuthStatus(true); //important to set authStatus to true if access token is valid, otherwise it will remain false and block access to the app
                    }


                    /*
                     * Access token is still valid.
                     */

                    // await getProfile();
                    // setAuthStatus(true); //its working 

                    return;
                }


                // =================================================
                // OFFLINE
                // =================================================

                console.log(
                    "[Auth] Offline authentication."
                );


                if (!localAccessToken) {

                    console.log(
                        "[Auth] No local access credential."
                    );

                    // setAuthStatus(false);
                    //continue writing on this part

                    if(authStatus===true){
                        generateLocalAccessToken();
                    }

                    return;
                }


                const localExpired =
                    checkLocalAccessTokenExpired(
                        localAccessToken
                    );


                if (localExpired) { //protect local token usage with authStatus check
                // if(localExpired){

                    console.log(
                        "[Auth] Local access token expired."
                    );
                    if (authStatus===true){
                    generateLocalAccessToken();

                    return;
                    }
                }else{

                console.log(
                    "[Auth] Offline access token is valid."
                );

                setAuthStatus(true);
                }


        // initializeAuthentication();

    }, [
        authReady,
        authStatus,
        accessToken,
        refreshToken,
        localAccessToken,
        checkOnlineStatus,
        checkAccessTokenExpired,
        checkLocalAccessTokenExpired,
        refreshAccessToken,
        getProfile,
    ]
    );

    // useEffect(() => {

    //     if (!authReady) {
    //         return;
    //     }

    //     initializeAuthentication();

    // }, [
    //     authReady,
    //     initializeAuthentication,
    // ]);

    // ============================================================
    // LOGOUT
    // ============================================================

    // const logout = async () => {

    //     try {

    //         setUser(null);

    //         setAccessToken(null);

    //         setRefreshToken(null);

    //         setLocalAccessToken(null);

    //         setDeviceId(null);

    //         setIsLoggedIn(false);

    //         setAuthStatus(false);

    //         setError(null);

    //     } catch (error) {

    //         console.error(
    //             "[Auth] Logout failed:",
    //             error
    //         );
    //     }
    // };


    // ============================================================
    // CONTEXT
    // ============================================================

    return (
        <AuthContext.Provider
            value={{
                user,

                refreshToken,

                accessToken,

                localAccessToken,

                deviceId,

                isLoggedIn,

                authStatus,

                isOnline,

                authReady,

                error,

                setUser,

                setAccessToken,

                setRefreshToken,

                setLocalAccessToken,

                setDeviceId,

                setAuthStatus,

                setIsLoggedIn,

                setError,

                login,

                logout,

                refreshAccessToken,

                getProfile,

                generateLocalAccessToken,

                checkAccessTokenExpired,

                checkLocalAccessTokenExpired,

                checkOnlineStatus,

                initializeAuthentication,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


// ================================================================
// USE AUTH
// ================================================================

export const useAuth = () => {

    const context =
        useContext(AuthContext);

    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};