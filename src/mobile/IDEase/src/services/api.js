import axios from "axios";

const BASE_URL = "https://campushub4293.pythonanywhere.com";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const getAdminOTP = async ({ email, username, password_hash }) => {
  const response = await api.post("/auth/admin_get_otp", {
    email,
    username,
    password_hash,
    role: "admin",
  });
  return response.data;
};

export default api;