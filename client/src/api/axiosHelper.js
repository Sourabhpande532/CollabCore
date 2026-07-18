import axios from "axios";
const API_URL = axios.create({
  baseURL: "https://collabcore-2ozg.onrender.com/auth",
  headers: {
    "Content-Type": "application/json",
  },
});
API_URL.interceptors.request.use((req) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    req.headers.Authorization = "Bearer " + token;
  }
  return req;
});

API_URL.interceptors.response.use(
  (res) => res,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // remove token
      localStorage.removeItem("userToken");

      // Redirect users to Login page ONLY for protected actions
      const method = error.config?.method?.toLowerCase();
      if (method && ["post", "put", "delete", "patch"].includes(method)) {
        window.location.href = "/login";
      } else {
        // For GET requests, we don't force redirect, allowing the user to browse
        // even if data fails to load due to being unauthenticated.
        console.warn("Unauthenticated request:", method);
      }
    }
    return Promise.reject(error);
  },
);

export default API_URL;
/* 
JUST SAKE OF UNDERSTANDING....
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

*/