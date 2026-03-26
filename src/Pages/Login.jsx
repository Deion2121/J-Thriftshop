import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { authService } from "../services/AuthServices";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  // Block access if already logged in
  if (currentUser) {
    if (currentUser.role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await authService.login({ email, password });
      const user = res?.user || res?.data?.user;
      const token = res?.token || res?.data?.token;

      if (!user || !token) throw new Error("Invalid login response");

      // Save user & token in context/localStorage
      login(user, token);

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      const friendlyError = err.message?.includes("Failed to fetch")
        ? "Server is offline. Please try again later."
        : err.message;
      setErrorMsg(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl bottom-10 right-10"></div>

      <div className="bg-white rounded-3xl shadow-2xl w-[400px] p-10 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black">Log In</h1>
          {errorMsg && (
            <p className="mt-4 text-sm text-red-500 bg-red-50 p-2 rounded-lg border border-red-200">
              {errorMsg}
            </p>
          )}
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-black text-white rounded-xl font-semibold transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;