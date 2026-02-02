export const forceLogout = () => {
  localStorage.removeItem("userToken");
  window.location.href = "/login";
};
/* 
---JUST TO KNOW USE IN AXIOS
import { forceLogout } from "../utils/logout";
API_URL.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      forceLogout();
    }
    return Promise.reject(error);
  }
);
*/
