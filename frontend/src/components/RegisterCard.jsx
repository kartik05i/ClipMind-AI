import { FcGoogle } from "react-icons/fc";

function RegisterCard() {
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
        placeholder="Full Name"
        className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
      />

      <input
        type="email"
        placeholder="Email"
        className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
      />

      <select className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4">
        <option>Learner</option>
        <option>Educator</option>
        <option>Content Creator</option>
      </select>

      <input
        type="password"
        placeholder="Password"
        className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
      />

      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full border border-gray-300 rounded-xl px-4 py-3"
      />

      <label className="flex items-center gap-2 mt-5 text-sm text-gray-600">
        <input type="checkbox" />
        I agree to the Terms & Conditions
      </label>

      <button className="w-full bg-blue-600 text-white py-3 rounded-xl mt-6 hover:bg-blue-700 transition">
        Create Account
      </button>

      <p className="text-center text-gray-600 mt-6">
        Already have an account?{" "}
        <button className="text-blue-600 font-semibold hover:underline">
          Login
        </button>
      </p>

    </div>
  );
}

export default RegisterCard;