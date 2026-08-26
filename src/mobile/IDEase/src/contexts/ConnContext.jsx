import { createContext, useContext, useCallback } from "react";
import { useApi } from "./ApiContext";
const ConnContext = createContext(null);

export const ConnProvider = ({ children }) => {

    const { api } = useApi()


    return (
        <ConnContext.Provider value={{
            
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