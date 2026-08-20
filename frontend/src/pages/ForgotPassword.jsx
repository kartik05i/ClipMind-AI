import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";


function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailVerified, setEmailVerified] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  // ==========================================
  // VERIFY EMAIL
  // ==========================================

  const handleVerifyEmail = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    if (!email) {

      setError("Please enter your email address.");
      return;

    }

    try {

      setLoading(true);

      const response = await api.post(
        "/auth/forgot-password",
        {
          email: email
        }
      );

      setMessage(response.data.message);

      setEmailVerified(true);

    } catch (error) {

      setError(
        error.response?.data?.detail ||
        "Something went wrong. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // RESET PASSWORD
  // ==========================================

  const handleResetPassword = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    if (!newPassword || !confirmPassword) {

      setError("Please fill in both password fields.");
      return;

    }

    if (newPassword !== confirmPassword) {

      setError("Passwords do not match.");
      return;

    }

    try {

      setLoading(true);

      const response = await api.post(
        "/auth/reset-password",
        {
          email: email,
          new_password: newPassword
        }
      );

      setMessage(response.data.message);

      setTimeout(() => {

        navigate("/");

      }, 1500);

    } catch (error) {

      setError(
        error.response?.data?.detail ||
        "Failed to reset password."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">


        {/* ================= HEADING ================= */}

        <h1 className="text-3xl font-bold text-gray-900">

          {emailVerified
            ? "Reset Password"
            : "Forgot Password?"
          }

        </h1>


        <p className="text-gray-500 mt-2">

          {emailVerified
            ? "Enter your new password below."
            : "Enter your email address to verify your account."
          }

        </p>


        {/* ================= MESSAGE ================= */}

        {message && (

          <p className="text-sm text-green-600 mt-5">

            {message}

          </p>

        )}


        {error && (

          <p className="text-sm text-red-600 mt-5">

            {error}

          </p>

        )}


        {/* ================= EMAIL VERIFICATION ================= */}

        {!emailVerified ? (

          <form
            onSubmit={handleVerifyEmail}
            className="mt-8"
          >

            <label className="block text-sm font-medium text-gray-700 mb-2">

              Email

            </label>


            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {

                setEmail(e.target.value);
                setError("");
                setMessage("");

              }}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold mt-6 transition duration-300 disabled:bg-blue-400"
            >

              {loading
                ? "Verifying..."
                : "Continue"
              }

            </button>

          </form>

        ) : (

          /* ================= RESET PASSWORD FORM ================= */

          <form
            onSubmit={handleResetPassword}
            className="mt-8"
          >


            {/* New Password */}

            <div className="mb-4">

              <label className="block text-sm font-medium text-gray-700 mb-2">

                New Password

              </label>


              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {

                  setNewPassword(e.target.value);
                  setError("");

                }}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

            </div>


            {/* Confirm Password */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">

                Confirm Password

              </label>


              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {

                  setConfirmPassword(e.target.value);
                  setError("");

                }}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold mt-6 transition duration-300 disabled:bg-blue-400"
            >

              {loading
                ? "Resetting Password..."
                : "Reset Password"
              }

            </button>

          </form>

        )}


        {/* ================= BACK TO LOGIN ================= */}

        <p className="text-center text-gray-600 mt-6">

          Remember your password?{" "}

          <Link
            to="/"
            className="text-blue-600 font-semibold hover:underline"
          >

            Back to Login

          </Link>

        </p>


      </div>

    </div>

  );
}


export default ForgotPassword;