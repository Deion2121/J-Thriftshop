// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { userService } from '../services/userService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ start true

  useEffect(() => {
    initSession();
  }, []);

  const initSession = async () => {
    try {
      const user = await userService.getCurrentUser();
      setCurrentUser(user ?? null); // ✅ null = guest, not an error
    } catch (err) {
      // ✅ should never reach here now, but just in case
      console.warn('initSession failed:', err.message);
      setCurrentUser(null);
    } finally {
      setLoading(false); // ✅ always stop loading regardless
    }
  };

  const login = (userData) => setCurrentUser(userData);

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.warn('Logout request failed:', err.message);
    } finally {
      setCurrentUser(null); // ✅ always clear user even if request fails
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout, initSession }}>
      {/* ✅ Don't render children until session is resolved */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;