import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();

     try {
    const res = await authService.login({ email, password });

    localStorage.setItem("user", JSON.stringify(res.user));

    // redirect depending on role
    if (res.user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }

  } catch (err) {
    alert(err.message);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl bottom-10 right-10"></div>


      <div className="bg-white rounded-3xl shadow-2xl w-[400px] p-10 relative z-10">

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-wide text-black">
            Log In
          </h1>
        </div>


        <form onSubmit={handleLogin} className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Email Address
            </label>

            <input
              type="email"
              placeholder="sample@example.com"
              className="w-full mt-2 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>


          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-2 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>


          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="w-full mt-4 py-3 rounded-xl bg-black text-white font-semibold hover:bg-yellow-500 hover:text-black transition duration-300"
          >
            Sign In
          </button>


          {/* REGISTER BUTTON */}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full py-3 rounded-xl border border-black text-black font-semibold hover:bg-black hover:text-white transition duration-300"
          >
            Create Account
          </button>

        </form>


        <p className="text-xs text-gray-400 text-center mt-6">
          © 2026 JThrift. All rights reserved.
        </p>

      </div>

    </div>
  );
};

export default Login;

