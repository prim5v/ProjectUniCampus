import { createContext, useContext, useEffect, useState } from "react";

import { useAuth } from "./AuthContext";
import socket from "../services/socket";

const NetworkContext = createContext(null);

export const NetworkProvider = ({ children }) => {
    const { accessToken, setAuthStatus, authStatus, user } = useAuth();

    const [accessTokenValid, setAccessTokenValid] = useState(false);

    useEffect(() => {
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("[NetworkContext] Access token effect triggered");

        console.log(
            "[NetworkContext] Access token exists:",
            !!accessToken
        );

        console.log(
            "[NetworkContext] Auth status:",
            authStatus
        );

        console.log(
            "[NetworkContext] Socket connected:",
            socket.connected
        );

        console.log(
            "[NetworkContext] Socket ID:",
            socket.id
        );

        // --------------------------------------------------
        // No access token
        // --------------------------------------------------

        if (!accessToken) {
            console.log(
                "[NetworkContext] ❌ No access token"
            );

            setAccessTokenValid(false);

            return;
        }

        console.log(
            "[NetworkContext] 🔐 Access token available"
        );

        // --------------------------------------------------
        // SOCKET CONNECT
        // --------------------------------------------------

        const handleConnect = () => {
            console.log("════════════════════════════════════");
            console.log("[Socket] 🟢 CONNECTED");
            console.log("[Socket] Socket ID:", socket.id);
            console.log("════════════════════════════════════");
            console.log(user);
            console.log(user.user.student_id);

            // --------------------------------------------------
            // Join authenticated user's token room
            // --------------------------------------------------

            console.log(
                "[NetworkContext] 🚪 Emitting join_active_access_token_room"
            );

            socket.emit(
                "join_active_access_token_room", {
                    room: user.user.student_id
                }
            );

            console.log(
                "[NetworkContext] 📤 join event emitted"
            );
        };

        // --------------------------------------------------
        // SOCKET DISCONNECT
        // --------------------------------------------------

        const handleDisconnect = (reason) => {
            console.log("════════════════════════════════════");
            console.log("[Socket] 🔴 DISCONNECTED");
            console.log("[Socket] Reason:", reason);
            console.log("════════════════════════════════════");

            setAccessTokenValid(false);
        };

        // --------------------------------------------------
        // SOCKET CONNECTION ERROR
        // --------------------------------------------------

        const handleConnectError = (error) => {
            console.log("════════════════════════════════════");
            console.error("[Socket] ❌ CONNECTION ERROR");

            console.error(
                "[Socket] Error:",
                error
            );

            console.error(
                "[Socket] Message:",
                error?.message
            );

            console.error(
                "[Socket] Description:",
                error?.description
            );

            console.error(
                "[Socket] Context:",
                error?.context
            );

            console.log("════════════════════════════════════");
        };

        // --------------------------------------------------
        // ACCESS TOKEN STATUS
        // --------------------------------------------------

        const handleProcess = (data) => {
            console.log("────────────────────────────────────");

            console.log(
                "[NetworkContext] 📡 accessToken:status received"
            );

            console.log(
                "[NetworkContext] Server response:",
                data
            );

            // ----------------------------------------------
            // VALID TOKEN
            // ----------------------------------------------

            if (data?.status === "success") {
                console.log(
                    "[NetworkContext] ✅ Access token VALID"
                );

                setAccessTokenValid(true);

                return;
            }

            // ----------------------------------------------
            // INVALID / EXPIRED TOKEN
            // ----------------------------------------------

            if (
                data?.status === "failed" ||
                data?.ResultCode === 401
            ) {
                console.log(
                    "[NetworkContext] ❌ Access token INVALID"
                );

                setAccessTokenValid(false);

                console.log(
                    "[NetworkContext] 🔒 Setting authStatus → false"
                );

                setAuthStatus(false);

                return;
            }

            // ----------------------------------------------
            // UNKNOWN RESPONSE
            // ----------------------------------------------

            console.warn(
                "[NetworkContext] ⚠️ Unknown token response:",
                data
            );
        };

        // ==================================================
        // REGISTER SOCKET LISTENERS FIRST
        // ==================================================

        console.log(
            "[NetworkContext] 👂 Registering socket listeners"
        );

        socket.on(
            "connect",
            handleConnect
        );

        socket.on(
            "disconnect",
            handleDisconnect
        );

        socket.on(
            "connect_error",
            handleConnectError
        );

        socket.on(
            "accessToken:status",
            handleProcess
        );

        console.log(
            "[NetworkContext] ✅ Socket listeners registered"
        );

        // ==================================================
        // CONNECT SOCKET
        // ==================================================

        if (socket.connected) {
            console.log(
                "[NetworkContext] 🟢 Socket already connected"
            );

            console.log(
                "[NetworkContext] Socket ID:",
                socket.id
            );

            // Socket is already connected,
            // therefore connect event will NOT fire again.
            // Join manually.

            handleConnect();
        } else {
            console.log(
                "[NetworkContext] 🟡 Socket NOT connected"
            );

            console.log(
                "[NetworkContext] 🔌 Calling socket.connect()..."
            );

            socket.connect();

            console.log(
                "[NetworkContext] 📞 socket.connect() called"
            );
        }

        // ==================================================
        // CLEANUP
        // ==================================================

        return () => {
            console.log(
                "[NetworkContext] 🧹 Cleaning socket listeners"
            );

            socket.off(
                "connect",
                handleConnect
            );

            socket.off(
                "disconnect",
                handleDisconnect
            );

            socket.off(
                "connect_error",
                handleConnectError
            );

            socket.off(
                "accessToken:status",
                handleProcess
            );

            console.log(
                "[NetworkContext] ✅ Socket listeners removed"
            );

            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        };
    }, [accessToken, setAuthStatus]);

    // ======================================================
    // CONTEXT
    // ======================================================

    return (
        <NetworkContext.Provider
            value={{
                accessTokenValid,
            }}
        >
            {children}
        </NetworkContext.Provider>
    );
};

// ==========================================================
// HOOK
// ==========================================================

export const useNetwork = () => {
    const context = useContext(NetworkContext);

    if (!context) {
        throw new Error(
            "useNetwork must be used inside a NetworkProvider"
        );
    }

    return context;
};