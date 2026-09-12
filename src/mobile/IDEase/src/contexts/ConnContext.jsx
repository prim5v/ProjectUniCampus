// import { createContext, useContext, useCallback } from "react";
// import { useApi } from "./ApiContext";
// import { useAuth } from "./AuthContext";
// import react, { useEffect } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// const ConnContext = createContext(null);

// const BALANCE_HIDDEN_KEY = "balance_hidden";

// export const ConnProvider = ({ children }) => {

//     const { api } = useApi()
//     const { accessToken, setLoading } = useAuth()
//     const [walletData, setWalletData] = react.useState(null);
//     const [balanceHidden, setBalanceHidden] = react.useState(false);

//     const fetchWalletData = useCallback(async () =>{

//         setLoading(true);
//         try {
//             const response = await api.get("/student/get/wallet")
//             console.log("Wallet response:", response.data?.data);
//             setWalletData(response.data?.data);
//         } catch (error) {
//             console.error("Wallet fetching failed:", error.response?.data || error.message);
//             setLoading(false);
//         }finally{
//             setLoading(false);
//         }
//     },[])

//     const fetchActivities = useCallback(async () =>{
//         setLoading(true);
//         try {
//             const response = await api.get("/students/get/recents");
//             console.log("Activities Response:", response.data?.data);
//             return response
//         } catch (error) {
//             console.error("Error fetching activities:", error.response?.data || error.message);
//         }finally{
//             setLoading(false);
//         }
//     })

//     const stkpush = async (payload) =>{
//         setLoading(true);
//         try {
//             const response = await api.post("/pay/student/deposit", payload)
//             return response;
//         } catch (error) {
//             console.error("STK Push failed:", error.response?.data || error.message);
//             setLoading(false);
//             throw error;
//         }finally{
//             setLoading(false);
//         }
//     }


//     useEffect(() => {
//         if(accessToken) {
//         fetchWalletData()
//     }
//     }, [fetchWalletData, accessToken])

//     useEffect(()=>{
//         const loadbalancestate = async () =>{
//             try {
//                 AsyncStorage.getItem()
//             } catch (error) {
                
//             }
//         }
//     },[])


//     return (
//         <ConnContext.Provider value={{
//             fetchWalletData,
//             fetchActivities,
//             walletData,
//             stkpush,
//         }}>
//             {children}
//         </ConnContext.Provider>
//     );
// };

// export const useConn = () => {

//     const context = useContext(ConnContext);

//     if(!context){

//         throw new Error(
//             "useConn must be used inside ConnProvider"
//         );
//     }

//     return context;
// }


// ```jsx
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useApi } from "./ApiContext";
import { useAuth } from "./AuthContext";

const ConnContext = createContext(null);

const BALANCE_HIDDEN_KEY = "balance_hidden";

export const ConnProvider = ({ children }) => {
    const { api } = useApi();
    const { accessToken, setLoading } = useAuth();

    const [walletData, setWalletData] = useState(null);
    const [balanceHidden, setBalanceHidden] = useState(false);

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

            return null;
        } finally {
            setLoading(false);
        }
    }, [api, accessToken, setLoading]);

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

    /**
     * Fetch wallet whenever authenticated
     */
    useEffect(() => {
        if (!accessToken) {
            setWalletData(null);
            return;
        }

        fetchWalletData();
    }, [accessToken, fetchWalletData]);

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

