// src/services/authService.js

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/*
Reusable request handler
*/
const request = async (endpoint, options = {}) => {

  try {

    const res = await fetch(`${API_URL}${endpoint}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options
    });

    let data = null;

    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      throw new Error(data?.message || "Request failed");
    }

    return data;

  } catch (error) {

    console.error("Auth API Error:", error);
    throw error;

  }

};

export const authService = {

  // ---------------- REGISTER ----------------
  register: async ({ email, password }) => {

    return request("/api/users/register", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

  },

  // ---------------- LOGIN ----------------
  login: async ({ email, password, role }) => {

    return request("/api/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password, role })
    });

  },

  // ---------------- LOGOUT ----------------
  logout: async () => {

    await request("/api/users/logout", {
      method: "POST"
    });

    return true;

  },

  // ---------------- GET CURRENT USER ----------------
  getCurrentUser: async () => {

    return request("/api/users/me", {
      method: "GET"
    });

  }

};