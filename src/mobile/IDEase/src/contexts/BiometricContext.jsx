import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import * as LocalAuthentication from "expo-local-authentication";

const BiometricContext = createContext(null);


export const BiometricProvider = ({ children }) => {

    const [hasHardware, setHasHardware] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [supportedTypes, setSupportedTypes] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);


    // ============================================================
    // CHECK BIOMETRIC SUPPORT
    // ============================================================

    const checkBiometricSupport = async () => {
        try {

            const compatible =
                await LocalAuthentication.hasHardwareAsync();

            const enrolled =
                await LocalAuthentication.isEnrolledAsync();

            const types =
                await LocalAuthentication.supportedAuthenticationTypesAsync();


            setHasHardware(compatible);
            setIsEnrolled(enrolled);
            setSupportedTypes(types);

            return {
                hasHardware: compatible,
                isEnrolled: enrolled,
                supportedTypes: types,
            };

        } catch (error) {

            console.error(
                "[Biometric] Failed to check biometric support:",
                error
            );

            return {
                hasHardware: false,
                isEnrolled: false,
                supportedTypes: [],
            };

        } finally {
            setLoading(false);
        }
    };


    // ============================================================
    // AUTHENTICATE
    // ============================================================

    const authenticate = async () => {

        try {

            // Make sure the device is capable of authentication
            const compatible =
                await LocalAuthentication.hasHardwareAsync();

            if (!compatible) {

                return {
                    success: false,
                    reason: "NO_HARDWARE",
                };
            }


            // Make sure the user has enrolled biometrics
            const enrolled =
                await LocalAuthentication.isEnrolledAsync();

            if (!enrolled) {

                return {
                    success: false,
                    reason: "NOT_ENROLLED",
                };
            }


            const result =
                await LocalAuthentication.authenticateAsync({
                    promptMessage: "Unlock UniCampus ID",
                    fallbackLabel: "Use Passcode",
                    disableDeviceFallback: false,
                });


            if (result.success) {

                setIsAuthenticated(true);

                return {
                    success: true,
                    reason: "AUTHENTICATED",
                };
            }


            return {
                success: false,
                reason: result.error || "AUTHENTICATION_FAILED",
            };

        } catch (error) {

            console.error(
                "[Biometric] Authentication error:",
                error
            );

            return {
                success: false,
                reason: "AUTHENTICATION_ERROR",
                error,
            };
        }
    };


    // ============================================================
    // LOCK
    // ============================================================

    const lock = () => {
        setIsAuthenticated(false);
    };


    // ============================================================
    // INITIAL CHECK
    // ============================================================

    useEffect(() => {

        checkBiometricSupport();

    }, []);


    return (
        <BiometricContext.Provider
            value={{
                hasHardware,
                isEnrolled,
                supportedTypes,

                isAuthenticated,
                loading,

                checkBiometricSupport,
                authenticate,
                lock,
            }}
        >
            {children}
        </BiometricContext.Provider>
    );
};


// ================================================================
// HOOK
// ================================================================

export const useBiometric = () => {

    const context = useContext(BiometricContext);

    if (!context) {
        throw new Error(
            "useBiometric must be used inside BiometricProvider"
        );
    }

    return context;
};