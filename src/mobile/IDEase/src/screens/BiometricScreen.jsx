import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    SafeAreaView,
    Touchable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBiometric } from "@/contexts/BiometricContext";
import { useAuth } from "@/contexts/AuthContext";

const BiometricScreen = () => {
    const { authenticate } = useBiometric();
    const { initializeAuthentication, setAuthStatus } = useAuth();


    const handleAuthentication = async () => {
        const resuccess = await authenticate();
        if(resuccess){
            console.log("[Auth] Biometric authentication SUCCESS");
            setAuthStatus(true); // Set authStatus to true upon successful biometric authentication
            // initializeAuthentication();
        }
    }

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.content}>

                {/* Biometric Icon */}

                <View style={styles.iconContainer}>
                    <Ionicons
                        name="finger-print"
                        size={72}
                        color="#2E8B3A"
                    />
                </View>


                {/* Heading */}

                <Text style={styles.title}>
                    Verify your identity
                </Text>


                {/* Description */}

                <Text style={styles.description}>
                    Use your fingerprint or face recognition
                    to securely unlock your UniCampus ID.
                </Text>


                {/* Authenticate Button */}

                <Pressable style={styles.button} onPress={() => {
                    // authenticate();
                    handleAuthentication();
                    // initializeAuthentication();
                }}>

                    <Ionicons
                        name="finger-print-outline"
                        size={23}
                        color="#FFFFFF"
                    />
                    {/* <TouchableOpacity onPress={() => {
                        // Handle biometric authentication here
                        authenticate();
                    }}> */}
                    <Text style={styles.buttonText}>
                        Authenticate
                    </Text>
                    {/* </TouchableOpacity> */}

                </Pressable>


                {/* Security Information */}

                <View style={styles.securityContainer}>

                    <Ionicons
                        name="shield-checkmark-outline"
                        size={18}
                        color="#777777"
                    />

                    <Text style={styles.securityText}>
                        Your biometric data stays on your device.
                    </Text>

                </View>

            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
    },

    iconContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: "#EAF6EC",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 36,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#171717",
        textAlign: "center",
        marginBottom: 14,
    },

    description: {
        fontSize: 16,
        lineHeight: 24,
        color: "#666666",
        textAlign: "center",
        maxWidth: 340,
        marginBottom: 34,
    },

    button: {
        width: "100%",
        height: 56,
        borderRadius: 15,
        backgroundColor: "#2E8B3A",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },

    buttonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
    },

    securityContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 28,
        gap: 7,
    },

    securityText: {
        fontSize: 12,
        color: "#777777",
    },
});

export default BiometricScreen;