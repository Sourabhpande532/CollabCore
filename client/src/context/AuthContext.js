import { createContext, useContext, useEffect, useState } from "react";
import API_URL, {
  clearApiCache,
  warmUpDashboardData,
} from "../api/axiosHelper";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const GUEST_CREDENTIALS = {
  email: "ratan@gmail.com",
  password: "123456",
};

const FALLBACK_GUEST_CREDENTIALS = {
  email: "a@gmail.com",
  password: "5321",
};

let prewarmedGuestAuth = null;
let prewarmedGuestPromise = null;

export const warmUpGuestSession = () => {
  if (prewarmedGuestAuth) {
    return Promise.resolve(prewarmedGuestAuth);
  }
  if (prewarmedGuestPromise) {
    return prewarmedGuestPromise;
  }

  prewarmedGuestPromise = API_URL.post("/login", GUEST_CREDENTIALS)
    .then((res) => {
      if (res.data?.token) {
        prewarmedGuestAuth = {
          token: res.data.token,
          user: res.data.user || {
            name: "Ratan",
            email: GUEST_CREDENTIALS.email,
          },
        };
        return prewarmedGuestAuth;
      }
      throw new Error("Missing token");
    })
    .catch(async () => {
      try {
        await API_URL.post("/signup", {
          name: "Ratan",
          email: GUEST_CREDENTIALS.email,
          password: GUEST_CREDENTIALS.password,
        }).catch(() => {});
        const retryRes = await API_URL.post("/login", GUEST_CREDENTIALS);
        if (retryRes.data?.token) {
          prewarmedGuestAuth = {
            token: retryRes.data.token,
            user: retryRes.data.user || {
              name: "Ratan",
              email: GUEST_CREDENTIALS.email,
            },
          };
          return prewarmedGuestAuth;
        }
      } catch {
        // Fallback to secondary demo account if needed
      }

      try {
        const fallbackRes = await API_URL.post(
          "/login",
          FALLBACK_GUEST_CREDENTIALS,
        );
        if (fallbackRes.data?.token) {
          prewarmedGuestAuth = {
            token: fallbackRes.data.token,
            user: fallbackRes.data.user || {
              name: "Guest User",
              email: FALLBACK_GUEST_CREDENTIALS.email,
            },
          };
          return prewarmedGuestAuth;
        }
      } catch {
        // Ignore background warmup errors
      }
      return null;
    })
    .finally(() => {
      prewarmedGuestPromise = null;
    });

  return prewarmedGuestPromise;
};

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

  const applySession = (sessionToken, sessionUser) => {
    localStorage.setItem("userToken", sessionToken);
    if (sessionUser) {
      localStorage.setItem("userInfo", JSON.stringify(sessionUser));
      setUser(sessionUser);
    }
    setToken(sessionToken);
  };

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
      const normalizedEmail = (data?.email || "").trim().toLowerCase();
      const isGuestMatch =
        normalizedEmail === GUEST_CREDENTIALS.email &&
        data?.password === GUEST_CREDENTIALS.password;

      if (isGuestMatch && prewarmedGuestAuth?.token) {
        applySession(prewarmedGuestAuth.token, prewarmedGuestAuth.user);
        warmUpDashboardData();
        toast.success("Logged in successfully");
        return true;
      }

      const response = await API_URL.post("/login", data);
      if (!response.data?.token) {
        throw new Error("Invalid credentials");
      }
      const resolvedUser = response.data.user || {
        name: normalizedEmail.split("@")[0] || "User",
        email: normalizedEmail,
      };
      applySession(response.data.token, resolvedUser);
      warmUpDashboardData();

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

  const guestLogin = async () => {
    warmUpDashboardData();

    if (prewarmedGuestAuth?.token) {
      applySession(prewarmedGuestAuth.token, prewarmedGuestAuth.user);
      toast.success("Logged in successfully");
      return true;
    }

    const warmupTask = warmUpGuestSession();
    const raceResult = await Promise.race([
      warmupTask,
      new Promise((resolve) => setTimeout(() => resolve("TIMEOUT"), 350)),
    ]);

    if (raceResult && raceResult !== "TIMEOUT" && raceResult.token) {
      applySession(raceResult.token, raceResult.user);
      toast.success("Logged in successfully");
      return true;
    }

    // If backend is cold-starting on Render, transition immediately to Dashboard
    // and seamlessly hydrate the verified JWT as soon as warmup finishes
    const optimisticUser = {
      name: "Ratan",
      email: GUEST_CREDENTIALS.email,
    };
    applySession("guest-session-warming", optimisticUser);
    toast.success("Logged in successfully");

    warmupTask.then((resolved) => {
      if (resolved?.token) {
        applySession(resolved.token, resolved.user);
      }
    });

    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        userRegister,
        login,
        guestLogin,
        isAuthenticated,
        logout,
        user,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
const useAuth = () => useContext(AuthContext);
export { AuthProvider, AuthContext, useAuth };
