const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const userService = {
  // Get current authenticated user
  getCurrentUser: async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/me`, {
        method: 'GET',
        credentials: 'include',
      });

      // ✅ 401 = not logged in, return null silently
      if (res.status === 401) return null;

      // ✅ 403 = token expired or invalid
      if (res.status === 403) return null;

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to fetch user');
      }

      return res.json();
    } catch (err) {
      // ✅ network error — don't crash the app
      console.warn('getCurrentUser failed:', err.message);
      return null;
    }
  },

  // Update user profile
  updateUser: async (formData) => {
    try {
      const res = await fetch(`${API_URL}/api/users/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (res.status === 401)
        throw new Error('Session expired. Please log in again.');

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Profile update failed');
      }

      return res.json();
    } catch (err) {
      console.error('updateUser failed:', err.message);
      throw err; // ✅ rethrow so UI can show the error
    }
  },
};