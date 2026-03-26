const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const userService = {
  getCurrentUser: async (token) => {
    if (!token) {
      console.log("❌ No token found");
      return null;
    }

    console.log("✅ TOKEN USED:", token);

    const res = await fetch(`${API_URL}/api/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ FIXED
      },
    });

    console.log("ME STATUS:", res.status);

    if (res.status === 401 || res.status === 403) return null;

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch current user");
    }

    return res.json();
  },

  logout: async () => Promise.resolve(),
};