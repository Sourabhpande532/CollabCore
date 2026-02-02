import axios from "axios";
const API_URL = axios.create({
  baseURL: "https://collab-core.vercel.app/auth",
  headers: {
    "Content-Type": "application/json",
  },
});
API_URL.interceptors.request.use((req) => {
  const token = localStorage.getItem("userToken");
  console.log(req);

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

      // optional: clear everything
      localStorage.clear();

      // redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default API_URL;
