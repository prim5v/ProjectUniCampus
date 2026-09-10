// import { io } from "socket.io-client";

// const SOCKET_URL = "https://projectunicampus.onrender.com";

// export const socket = io(SOCKET_URL, {
//   transports: ["polling", "websocket"],
//   autoConnect: true,
// });

// export default socket;
import { io } from "socket.io-client";
import * as SecureStore from "expo-secure-store";

const SOCKET_URL = "https://projectunicampus.onrender.com";

export const socket = io(SOCKET_URL, {
  transports: ["polling", "websocket"],
  autoConnect: false,

  auth: async (cb) => {
    const accessToken =
      await SecureStore.getItemAsync("access_token");

    cb({
      token: accessToken,
    });
  },
});

socket.on("connect", () => {
  console.log("[Socket] Connected:", socket.id);
});

socket.on("connect_error", (error) => {
  console.log("[Socket] Connection error:", error.message);
});

export default socket;