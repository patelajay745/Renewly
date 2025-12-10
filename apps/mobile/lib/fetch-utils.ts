import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL + "/api/v1";

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
  (error) => {
    console.error("API Error:", error.message);
    if (error.response) {
      console.error(
        "Error Response:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error("Network Error - No response received");
    }
    return Promise.reject(error);
  }
);

export default api;
