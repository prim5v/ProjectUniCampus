import { createContext, useContext, useCallback } from "react";
import { useApi } from "./ApiContext";
import { useAuth } from "./AuthContext";
import react, { useEffect } from "react";
const ConnContext = createContext(null);

export const ConnProvider = ({ children }) => {

    const { api } = useApi()
    const { accessToken } = useAuth()

    const wallet = useCallback(async () =>{

        try {
            const response = await api.get("/student/get/wallet")
            console.log("Wallet response:", response.data);
            // data = resp
        } catch (error) {
            console.error("Wallet fetching failed:", error.response?.data || error.message);
        }
    },[])

    const stkpush = async (payload) =>{

        try {
            const response = await api.post("/pay/student/deposit", payload)
            return response;
        } catch (error) {
            console.error("STK Push failed:", error.response?.data || error.message);
            throw error;
        }
    }
    

    useEffect(() => {
        if(accessToken) {
        wallet()
    }
    }, [wallet, accessToken])


    return (
        <ConnContext.Provider value={{
            wallet
        }}>
            {children}
        </ConnContext.Provider>
    );
};

export const useConn = () => {

    const context = useContext(ConnContext);

    if(!context){

        throw new Error(
            "useConn must be used inside ConnProvider"
        );
    }

    return context;
}