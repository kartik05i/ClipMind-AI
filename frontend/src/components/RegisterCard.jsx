import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

import { registerUser } from "../services/authService";

function RegisterCard() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Learner",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const data = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      const response = await registerUser(data);

      alert(response.message);

      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-[420px]">

      <h2 className="text-3xl font-bold text-gray-900">
        Create Your Account
      </h2>

      <p className="text-gray-500 mt-2">
        Start summarizing videos in seconds.
      </p>

      <button className="w-full mt-8 border border-gray-300 rounded-xl py-3 flex items-center justify-center gap-3 font-medium hover:bg-gray-50 transition">
        <FcGoogle size={22} />
        Continue with Google
      </button>

      <div className="flex items-center my-6">
        <hr className="flex-1 border-gray-300" />
        <span className="mx-4 text-gray-500 text-sm">OR</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
      />

      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
      >
        <option>Learner</option>
        <option>Educator</option>
        <option>Content Creator</option>
      </select>

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-xl px-4 py-3"
      />

      <label className="flex items-center gap-2 mt-5 text-sm text-gray-600">
        <input type="checkbox" />
        I agree to the Terms & Conditions
      </label>

      <button
        onClick={handleRegister}
        className="w-full bg-blue-600 text-white py-3 rounded-xl mt-6 hover:bg-blue-700 transition"
      >
        Create Account
      </button>

      <p className="text-center text-gray-600 mt-6">
        Already have an account?{" "}
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 font-semibold hover:underline"
        >
          Login
        </button>
      </p>

    </div>
  );
}

export default RegisterCard;