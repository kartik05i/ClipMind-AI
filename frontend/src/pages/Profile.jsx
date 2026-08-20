import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Shield,
  CheckCircle,
  Loader2,
  Pencil,
  Save,
  X,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await api.get("/auth/me");

      setUser(response.data);
      setName(response.data.name);

    } catch (error) {
      console.error(
        "Failed to fetch profile:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setName(user?.name || "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setName(user?.name || "");
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Name cannot be empty");
      return;
    }

    try {
      setSaving(true);

      const response = await api.put(
        `/auth/profile?name=${encodeURIComponent(
          name.trim()
        )}`
      );

      const updatedUser = response.data.user;

      // Update page data
      setUser(updatedUser);

      // Update localStorage
      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setIsEditing(false);

      alert("Profile updated successfully!");

    } catch (error) {
      console.error(
        "Failed to update profile:",
        error
      );

      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert("Failed to update profile");
      }

    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[500px]">

          <div className="flex flex-col items-center">

            <Loader2
              size={40}
              className="animate-spin text-blue-600"
            />

            <p className="mt-4 text-gray-500">
              Loading profile...
            </p>

          </div>

        </div>
      </DashboardLayout>
    );
  }

  const userName = user?.name || "User";
  const initial = userName.charAt(0).toUpperCase();

  return (
    <DashboardLayout>

      <div className="max-w-5xl mx-auto">

        {/* PAGE HEADER */}

        <div className="flex items-start justify-between mb-8">

          <div>

            <h1 className="text-4xl font-bold text-gray-900">
              My Profile
            </h1>

            <p className="text-gray-500 mt-2 text-lg">
              View and manage your account information.
            </p>

          </div>

          {!isEditing ? (

            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition"
            >
              <Pencil size={18} />

              Edit Profile
            </button>

          ) : (

            <div className="flex items-center gap-3">

              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex items-center gap-2 border border-gray-300 hover:bg-gray-100 text-gray-700 px-5 py-3 rounded-lg font-medium transition"
              >
                <X size={18} />

                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition disabled:bg-blue-400"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />

                    Save Changes
                  </>
                )}
              </button>

            </div>

          )}

        </div>


        {/* PROFILE CARD */}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

          {/* PROFILE HEADER */}

          <div className="p-8 border-b border-gray-200">

            <div className="flex items-center gap-6">

              {/* AVATAR */}

              <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold">

                {initial}

              </div>


              {/* USER DETAILS */}

              <div className="flex-1">

                {isEditing ? (

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    className="text-2xl font-bold text-gray-900 border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                  />

                ) : (

                  <h2 className="text-3xl font-bold text-gray-900">
                    {userName}
                  </h2>

                )}


                <div className="flex items-center gap-2 mt-3">

                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                    {user?.role || "User"}
                  </span>


                  {user?.is_active && (

                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">

                      <CheckCircle size={15} />

                      Active

                    </span>

                  )}

                </div>

              </div>

            </div>

          </div>


          {/* ACCOUNT INFORMATION */}

          <div className="p-8">

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Account Information
            </h2>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* NAME */}

              <div className="border border-gray-200 rounded-xl p-5">

                <div className="flex items-center gap-3 mb-3">

                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <User size={20} />
                  </div>

                  <p className="text-sm text-gray-500">
                    Full Name
                  </p>

                </div>


                {isEditing ? (

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                ) : (

                  <p className="text-lg font-semibold text-gray-900">
                    {userName}
                  </p>

                )}

              </div>


              {/* EMAIL */}

              <div className="border border-gray-200 rounded-xl p-5">

                <div className="flex items-center gap-3 mb-3">

                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Mail size={20} />
                  </div>

                  <p className="text-sm text-gray-500">
                    Email Address
                  </p>

                </div>


                <p className="text-lg font-semibold text-gray-900 break-all">
                  {user?.email || "Not available"}
                </p>

                {isEditing && (
                  <p className="text-xs text-gray-400 mt-2">
                    Email cannot be changed.
                  </p>
                )}

              </div>


              {/* ROLE */}

              <div className="border border-gray-200 rounded-xl p-5">

                <div className="flex items-center gap-3 mb-3">

                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Shield size={20} />
                  </div>

                  <p className="text-sm text-gray-500">
                    Account Role
                  </p>

                </div>


                <p className="text-lg font-semibold text-gray-900">
                  {user?.role || "User"}
                </p>

                {isEditing && (
                  <p className="text-xs text-gray-400 mt-2">
                    Role can only be changed by an administrator.
                  </p>
                )}

              </div>


              {/* ACCOUNT STATUS */}

              <div className="border border-gray-200 rounded-xl p-5">

                <div className="flex items-center gap-3 mb-3">

                  <div className="p-2 bg-green-50 rounded-lg text-green-600">
                    <CheckCircle size={20} />
                  </div>

                  <p className="text-sm text-gray-500">
                    Account Status
                  </p>

                </div>


                <p
                  className={`text-lg font-semibold ${
                    user?.is_active
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {user?.is_active
                    ? "Active"
                    : "Inactive"}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default Profile;