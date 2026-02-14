import axios from "axios";
const API_URL = axios.create({
  baseURL: "https://collab-core.vercel.app/auth",
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
      // redirect to login
      window.location.href = "/login";
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