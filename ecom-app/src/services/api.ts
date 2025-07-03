import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const requestUrl = error.config.url;

      // Do not redirect for login endpoint
      if (
        requestUrl?.includes("/auth/login") ||
        requestUrl?.includes("/auth/signup")
      ) {
        return Promise.reject(error);
      }
      if (status === 401) {
        localStorage.removeItem("auth_token");
        window.location.href = "/session-expired";
      } else if (status === 400) {
        window.location.href = "/error/400";
      } else if (status === 403) {
        window.location.href = "/error/403";
      } else if (status === 500) {
        window.location.href = "/error/500";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
