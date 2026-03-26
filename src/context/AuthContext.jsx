import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { userService } from "../services/userServices";
import { authService } from "../services/AuthServices";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ----------------------------------------
  // Initialize user session
  // ----------------------------------------
  const initSession = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");

      console.log("INIT TOKEN:", token);

      //No token → no session
      if (!token) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      //API first
      try {
        const user = await userService.getCurrentUser(token);

        console.log("SESSION USER:", user);

        setCurrentUser(user);

        // ✅ Save backup (optional but recommended)
        localStorage.setItem("user", JSON.stringify(user));

      } catch (apiError) {
        console.warn("API failed, using localStorage fallback");

        // ✅ Fallback to stored user
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        } else {
          setCurrentUser(null);
        }
      }

    } catch (error) {
      console.error("❌ Session initialization failed:", error.message);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initSession();
  }, [initSession]);

  // ----------------------------------------
  // Login
  // ----------------------------------------
  const login = (userData, token) => {
    console.log("LOGIN USER:", userData);

    setCurrentUser(userData);

    if (token) {
      localStorage.setItem("accessToken", token);
    }

    // ✅ Save user for refresh persistence
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ----------------------------------------
  // Logout
  // ----------------------------------------
  const logout = async () => {
    try {
      await userService.logout();
    } catch (error) {
      console.warn("Logout API failed:", error.message);
    } finally {
      setCurrentUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  };

  // ----------------------------------------
  // Context value
  // ----------------------------------------
  const value = {
    currentUser,
    loading,
    login,
    logout,
    initSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* ✅ Prevent render until auth ready */}
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

// ----------------------------------------
// Custom hook
// ----------------------------------------
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export default AuthContext;