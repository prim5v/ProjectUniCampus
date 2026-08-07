import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    // SafeAreaView,
    Dimensions,
} from "react-native";
import { router } from "expo-router";

import LottieView from "lottie-react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
const { width } = Dimensions.get("window");
import ScreenHeader from '../components/ScreenHeader';
// Your Lottie file
const NFC_ANIMATION = require("../../assets/animations/6.json");

export default function NfcEidScreen() {
    const [mode, setMode] = useState("nfc");

    // UI TEST DATA ONLY.
    // Later replace this with encrypted/signed payload.
    const qrValue = "BSE-05-0093/2025";

    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    activeOpacity={0.7}
                    onPress={() => {}}
                >
                    <Text style={styles.backIcon}>‹</Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>NFC e-ID</Text>

                <TouchableOpacity
                    style={styles.moreButton}
                    activeOpacity={0.7}
                    onPress={() => {}}
                >
                    <Text style={styles.moreIcon}>•••</Text>
                </TouchableOpacity>
            </View> */}
            <ScreenHeader
            title="NFC e-ID" 
            onBackPress={() => router.back()}
            showBackButton={true} />

            {/* MAIN CONTENT */}
            <View style={styles.content}>
                {mode === "nfc" ? (
                    <NfcView />
                ) : (
                    <QrView value={qrValue} />
                )}
            </View>

            {/* MODE SWITCHER */}
            <View style={styles.modeContainer}>
                <TouchableOpacity
                    style={[
                        styles.modeButton,
                        mode === "nfc" && styles.activeMode,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => setMode("nfc")}
                >
                    <Text
                        style={[
                            styles.modeText,
                            mode === "nfc" && styles.activeModeText,
                        ]}
                    >
                        NFC
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.modeButton,
                        mode === "qr" && styles.activeMode,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => setMode("qr")}
                >
                    <Text
                        style={[
                            styles.modeText,
                            mode === "qr" && styles.activeModeText,
                        ]}
                    >
                        QR
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

/* ------------------------------------------------ */
/* NFC VIEW */
/* ------------------------------------------------ */

function NfcView() {
    return (
        <View style={styles.nfcView}>
            <View style={styles.animationContainer}>
                <LottieView
                    source={NFC_ANIMATION}
                    autoPlay
                    loop
                    style={styles.nfcAnimation}
                />
            </View>

            <View style={styles.statusContainer}>
                <Text style={styles.statusTitle}>
                    Working in background background
                </Text>

                <Text style={styles.statusSubtitle}>
                    No internet required required
                </Text>
            </View>
        </View>
    );
}

/* ------------------------------------------------ */
/* QR VIEW */
/* ------------------------------------------------ */

function QrView({ value }) {
    return (
        <View style={styles.qrView}>
            <Text style={styles.qrTitle}>
                Scan to verify
            </Text>

            <Text style={styles.qrSubtitle}>
                Present this code to a UniCampus reader
            </Text>

            <View style={styles.qrContainer}>
                <QRCode
                    value={value}
                    size={width * 0.62}
                    color="#000000"
                    backgroundColor="#FFFFFF"
                    quietZone={18}
                />
            </View>

            <Text style={styles.qrHint}>
                Keep your screen steady while scanning
            </Text>
        </View>
    );
}

/* ------------------------------------------------ */
/* STYLES */
/* ------------------------------------------------ */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    /* HEADER */

    header: {
        height: 64,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    backButton: {
        width: 42,
        height: 42,
        alignItems: "flex-start",
        justifyContent: "center",
    },

    backIcon: {
        fontSize: 34,
        fontWeight: "300",
        color: "#222222",
        lineHeight: 38,
    },

    headerTitle: {
        position: "absolute",
        left: 0,
        right: 0,
        textAlign: "center",

        fontSize: 17,
        fontWeight: "600",
        color: "#222222",
    },

    moreButton: {
        width: 42,
        height: 42,
        alignItems: "flex-end",
        justifyContent: "center",
    },

    moreIcon: {
        fontSize: 16,
        letterSpacing: 2,
        color: "#222222",
    },

    /* CONTENT */

    content: {
        flex: 1,
        paddingHorizontal: 20,
    },

    /* NFC */

    nfcView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    animationContainer: {
        width: width * 0.72,
        height: width * 0.72,

        alignItems: "center",
        justifyContent: "center",

        marginTop: -35,
    },

    nfcAnimation: {
        width: "100%",
        height: "100%",
    },

    statusContainer: {
        alignItems: "center",
        marginTop: 12,
    },

    statusTitle: {
        fontSize: 15,
        fontWeight: "500",
        color: "#252525",
        paddingLeft: 54,
    },

    statusSubtitle: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: "400",
        color: "#777777",
        paddingLeft: 35,
    },

    /* QR */

    qrView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 30,
    },

    qrTitle: {
        fontSize: 21,
        fontWeight: "600",
        color: "#202020",
        marginBottom: 7,
    },

    qrSubtitle: {
        fontSize: 14,
        color: "#777777",
        textAlign: "center",
        marginBottom: 28,
        paddingHorizontal: 25,
    },

    qrContainer: {
        padding: 18,
        backgroundColor: "#FFFFFF",

        borderRadius: 20,

        // Very subtle elevation
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 12,

        elevation: 3,
    },

    qrHint: {
        marginTop: 24,
        fontSize: 13,
        color: "#8A8A8A",
        textAlign: "center",
    },

    /* MODE SWITCHER */

    modeContainer: {
        flexDirection: "row",

        alignSelf: "center",

        backgroundColor: "#F2F2F2",

        borderRadius: 30,

        padding: 4,

        marginBottom: 18,
    },

    modeButton: {
        minWidth: 95,

        paddingVertical: 10,
        paddingHorizontal: 20,

        borderRadius: 24,

        alignItems: "center",
        justifyContent: "center",
    },

    activeMode: {
        backgroundColor: "#2E8B3A",
    },

    modeText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#777777",
    },

    activeModeText: {
        color: "#FFFFFF",
    },
});