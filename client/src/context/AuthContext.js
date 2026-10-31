import { createContext, useContext, useEffect, useState } from "react";
import API_URL, { clearApiCache } from "../api/axiosHelper";
import toast from "react-hot-toast";

const AuthContext = createContext();

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("userInfo");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("userToken"));
  const [user, setUser] = useState(() => getStoredUser());
  const isAuthenticated = !!token;

  useEffect(() => {
    if (!token) {
      setUser(null);
      localStorage.removeItem("userInfo");
      return;
    }
    // Skip redundant /me request if login just hydrated user details
    if (user && user.email) {
      return;
    }
    let active = true;
    API_URL.get("/me")
      .then((res) => {
        if (active && res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem("userInfo", JSON.stringify(res.data.user));
        }
      })
      .catch(() => {
        // Keep session active unless protected mutation fails
      });
    return () => {
      active = false;
    };
  }, [token, user]);

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    clearApiCache();
    setToken(null);
    setUser(null);
    toast.success("Logged out");
  };

  const userRegister = async (data) => {
    try {
      await API_URL.post("/signup", data);
      toast.success("Registration Successful");
      return true;
    } catch (error) {
      console.error(error.message);
      toast.error(error.response?.data?.message || "Registration Failed");
      return false;
    }
  };

  const login = async (data) => {
    try {
      const response = await API_URL.post("/login", data);
      if (!response.data?.token) {
        throw new Error("Invalid credentials");
      }
      localStorage.setItem("userToken", response.data.token);
      if (response.data.user) {
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        setUser(response.data.user);
      }
      setToken(response.data.token);

      // Immediately start parallel prefetch of primary dashboard data
      API_URL.get("/projects").catch(() => {});
      API_URL.get("/tasks").catch(() => {});

      toast.success("Logged in successfully");
      return true;
    } catch (error) {
      console.error(error.message);
      toast.error(
        error.response?.data?.message || "Invalid email or password",
      );
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ userRegister, login, isAuthenticated, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
const useAuth = () => useContext(AuthContext);
export { AuthProvider, AuthContext, useAuth };
