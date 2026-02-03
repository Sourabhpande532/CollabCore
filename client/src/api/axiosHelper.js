import axios from "axios";
const API_URL = axios.create({
  baseURL: "http://localhost:4001/auth",
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
