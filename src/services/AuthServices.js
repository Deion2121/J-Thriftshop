const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const authService = {
  // ---------------- REGISTER ----------------
  register: async ({ email, password }) => {
    try {
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Register failed");
      return data;
    } catch (error) {
      // Catching "Failed to fetch" (Server down) errors specifically
      throw new Error(error.message === "Failed to fetch" 
        ? "Cannot connect to server. Is the backend running?" 
        : error.message);
    }
  },

  // ---------------- LOGIN ----------------
  login: async ({ email, password }) => {
    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      
      console.log("🔍 LOGIN RESPONSE:", data);
      return data; 
    } catch (error) {
      throw new Error(error.message === "Failed to fetch" 
        ? "Backend server is not responding (Check port 3000)" 
        : error.message);
    }
  },

  // ---------------- GET CURRENT USER ----------------
  getCurrentUser: async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/users/me`, { // Fixed path: usually under /api/users/me
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch user");
      return data;
    } catch (error) {
      throw new Error("Session expired or server unreachable");
    }
  },

  // ---------------- LOGOUT ----------------
  logout: async () => {
    try {
      await fetch(`${API_URL}/api/users/logout`, { method: "POST" });
    } catch (e) {
      console.error("Logout request failed, but clearing local session anyway.");
    }
  },
};