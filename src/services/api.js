import axios from "axios";
import { auth } from "../config/firebase";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach Firebase ID Token to outgoing requests
api.interceptors.request.use(
  async (config) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const token = await currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error retrieving Firebase ID token:", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;