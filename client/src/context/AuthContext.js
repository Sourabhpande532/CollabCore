import { createContext, useContext, useState } from "react";
import API_URL from "../api/axiosHelper";
import toast from "react-hot-toast";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("userToken"));
  const isAuthenticated = !!token;
  console.log(isAuthenticated);

  const logout = () => {
    localStorage.removeItem("userToken");
    setToken(null);
  };

  const userRegister = async (data) => {
    try {
      await API_URL.post("/signup", data);
      toast.success("Registration Successful");
      return true;
    } catch (error) {
      console.error(error.message);
      toast.error("Registration Failed");
      return false;
    }
  };

  const login = async (data) => {
    try {
      const response = await API_URL.post("/login", data);
      if (!response.data?.token) {
        throw new Error("Invalid credential");
      }
      localStorage.setItem("userToken", response.data.token);
      setToken(response.data.token);
      toast.success("Logged in successfully");
      return true;
    } catch (error) {
      console.error(error.message);
      toast.error(
        error.response?.data?.message || "Invalide email or password",
      );
      return false;
    }
  };
  return (
    <AuthContext.Provider
      value={{ userRegister, login, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
const useAuth = () => useContext(AuthContext);
export { AuthProvider, AuthContext, useAuth };
