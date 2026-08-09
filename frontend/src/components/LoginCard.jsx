import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

import { loginUser } from "../services/authService";

function LoginCard() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      await loginUser(
        email,
        password
      );

      alert("Login Successful!");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-[420px]">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-gray-900">
        Welcome Back
      </h2>

      <p className="text-gray-500 mt-2">
        Sign in to continue to ClipMind AI
      </p>

      {/* Google Button */}
      <button className="w-full mt-8 border border-gray-300 rounded-xl py-3 flex items-center justify-center gap-3 font-medium hover:bg-gray-50 transition duration-300">
        <FcGoogle size={22} />
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center my-6">
        <hr className="flex-1 border-gray-300" />

        <span className="mx-4 text-gray-500 text-sm font-medium">
          OR
        </span>

        <hr className="flex-1 border-gray-300" />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Remember Me + Forgot Password */}
      <div className="flex items-center justify-between mt-5">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            className="accent-blue-600"
          />
          Remember Me
        </label>

        <Link
          to="/forgot-password"
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Login Button */}
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold mt-6 transition duration-300 disabled:bg-blue-400"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {/* Register */}
      <p className="text-center text-gray-600 mt-6">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-blue-600 font-semibold hover:underline"
        >
          Register
        </Link>
      </p>
    </div>
  );
}

export default LoginCard;