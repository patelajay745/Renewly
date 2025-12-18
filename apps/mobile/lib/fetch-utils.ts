import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL + "/v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error("API Error:", error.message);
    if (error.response) {
      console.error("Error Response:",
        error.response.status,
        error.response.data
      );

      // if (error.response.status === 401) {
      //   console.log("Unauthorized - logging out user");
      //   try {
      //     // Clear all Clerk tokens from SecureStore
      //     const keys = [
      //       "__clerk_client_jwt",
      //       "__clerk_refresh_token",
      //       "__clerk_session_id",
      //     ];

      //     await Promise.all(
      //       keys.map(key => SecureStore.deleteItemAsync(key).catch(() => { }))
      //     );

      //     // Redirect to sign-in page
      //     router.replace("/sign-in");
      //   } catch (logoutError) {
      //     console.error("Error during logout:", logoutError);
      //   }
      // }
    } else if (error.request) {
      console.error("Network Error - No response received");
    }
    return Promise.reject(error);
  }
);

export default api;
