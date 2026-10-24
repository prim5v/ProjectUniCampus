import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useApi } from "./ApiContext";
import { useAuth } from "./AuthContext";
import { Alert, NativeModules } from "react-native";
import axios from "axios";

const ConnContext = createContext(null);

const BALANCE_HIDDEN_KEY = "balance_hidden";

export const ConnProvider = ({ children }) => {
    const { api } = useApi();
    const { accessToken, setLoading, authStatus, user } = useAuth();
    const [publicKey, setPublicKey] = useState("");

    const [walletData, setWalletData] = useState(null);
    const [balanceHidden, setBalanceHidden] = useState(false);
    const { UniCampusHCE } = NativeModules;
    const hasInserted = useRef(false);

    /**
     * Fetch wallet information
     */
    const fetchWalletData = useCallback(async () => {
        if (!accessToken) {
            return null;
        }

        setLoading(true);

        try {
            const response = await api.get("/student/get/wallet");

            console.log(
                "Wallet response:",
                response.data?.data
            );

            const data = response.data?.data;

            setWalletData(data);

            return data;
        } catch (error) {
            console.error(
                "Wallet fetching failed:",
                error.response?.data || error.message
            );
            Alert.alert(
            "Wallet fetching failed",
            "We couldn't load your Wallet data, Please refresh.",
            [{ text: "OK" }]
            );

            return null;
        } finally {
            setLoading(false);
        }
    }, [api, accessToken, setLoading]);

// having issues with public key insert, should i insert it once on user loggin?
    const fetchPublicKey = useCallback(async() => {
        
        try {
            const response = await axios.get("https://prim5v.pythonanywhere.com/generate_rsa");
            const publicKey = response.data;
            if (publicKey){
                console.log("Public Key:", publicKey);
                // UniCampusHCE.setPublicKey(publicKey);
                setPublicKey(publicKey);
                console.log("Public key inserted successfully")
            }
            
            
            // return result; 
        } catch (error) {
            console.error("public key failed:", error.response?.data || error.message);
        }
    }, [api, UniCampusHCE])

    /**
     * Fetch recent activities
     */
    const fetchActivities = useCallback(async () => {
        if (!accessToken) {
            return [];
        }

        setLoading(true);

        try {
            const response = await api.get("/students/get/recents");

            console.log(
                "Activities response:",
                response.data?.data
            );

            return response.data?.data || [];
        } catch (error) {
            console.error(
                "Activities fetching failed:",
                error.response?.data || error.message
            );
            Alert.alert(
                "Activities fetching failed",
                "We couldn't load your recent activities, Please refresh.",
                [{text: "Ok"}]
            );

            return [];
        } finally {
            setLoading(false);
        }
    }, [api, accessToken, setLoading]);

    /**
     * Initiate STK Push
     */
    const stkpush = useCallback(
        async (payload) => {
            setLoading(true);

            try {
                const response = await api.post(
                    "/pay/student/deposit",
                    payload
                );

                console.log(
                    "STK Push response:",
                    response.data
                );

                return response;
            } catch (error) {
                console.error(
                    "STK Push failed:",
                    error.response?.data || error.message
                );
                Alert.alert(
                "STK Push failed",
                "mpesa STK push failed, Please try again.",
                [{text: "Ok"}]
            );


                throw error;
            } finally {
                setLoading(false);
            }
        },
        [api, setLoading]
    );

    /**
     * Load saved balance visibility state
     */
    useEffect(() => {
        const loadBalanceState = async () => {
            try {
                const savedState = await AsyncStorage.getItem(
                    BALANCE_HIDDEN_KEY
                );

                if (savedState !== null) {
                    setBalanceHidden(savedState === "true");
                }
            } catch (error) {
                console.error(
                    "Failed to load balance visibility:",
                    error
                );
            }
        };

        loadBalanceState();
    }, []);



    /**
     * Save balance visibility state
     */
    const toggleBalanceVisibility = useCallback(async () => {
        try {
            const newState = !balanceHidden;

            setBalanceHidden(newState);

            await AsyncStorage.setItem(
                BALANCE_HIDDEN_KEY,
                String(newState)
            );
        } catch (error) {
            console.error(
                "Failed to save balance visibility:",
                error
            );
        }
    }, [balanceHidden]);


    
    

    const insertOnModule = useCallback(async () => {
        const studentId = user?.user?.student_id;

        if (!publicKey || !studentId || hasInserted.current) {
            return;
        }

        try {
            const alreadyStored =
                await UniCampusHCE.hasStoredCredentials();

            if (alreadyStored) {
                hasInserted.current = true;
                console.log("HCE credentials already stored");
                return;
            }

            await UniCampusHCE.setPublicKey(publicKey);
            await UniCampusHCE.setStudentId(studentId);

            hasInserted.current = true;
            console.log("HCE credentials stored successfully");
        } catch (error) {
            console.error("HCE credential check/insertion failed:", error);
        }
    }, [publicKey, user, UniCampusHCE]);

    useEffect(() => {
        insertOnModule();
    }, [insertOnModule]);

    /**
     * Fetch wallet whenever authenticated
     */
    useEffect(() => {
        if (!accessToken || !authStatus) {
            setWalletData(null);
            return;
        }

        fetchWalletData();
    }, [accessToken, fetchWalletData, authStatus]);
    

    useEffect(() =>{
        fetchPublicKey();
    }, [fetchPublicKey])

    return (
        <ConnContext.Provider
            value={{
                // Wallet
                walletData,
                fetchWalletData,

                // Activities
                fetchActivities,

                // Payments
                stkpush,

                // Balance visibility
                balanceHidden,
                setBalanceHidden,
                toggleBalanceVisibility,
            }}
        >
            {children}
        </ConnContext.Provider>
    );
};

export const useConn = () => {
    const context = useContext(ConnContext);

    if (!context) {
        throw new Error(
            "useConn must be used inside ConnProvider"
        );
    }

    return context;
};

