import { useEffect, useState, useRef } from "react";
import { Bell, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

const DashboardNavbar = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const getCurrentUser = async () => {
    try {
      const response = await api.get("/auth/me");

      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  const handleLogout = () => {
    // Remove authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to home page
    navigate("/");
  };

  const handleProfile = () => {
    setShowDropdown(false);

    // You can create this page later
    navigate("/profile");
  };

  const handleSettings = () => {
    setShowDropdown(false);

    // You can create this page later
    navigate("/settings");
  };

  const userName = user?.name || "User";
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">

      {/* LOGO */}

      <h1 className="text-2xl font-bold text-blue-600">
        ClipMind AI
      </h1>


      {/* RIGHT SIDE */}

      <div className="flex items-center gap-6">

        {/* NOTIFICATION */}

        <Bell
          className="cursor-pointer text-gray-600 hover:text-blue-600 transition"
        />


        {/* USER DROPDOWN */}

        <div
          className="relative"
          ref={dropdownRef}
        >

          {/* USER BUTTON */}

          <button
            onClick={() =>
              setShowDropdown(!showDropdown)
            }
            className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition"
          >

            {/* AVATAR */}

            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">

              {initial}

            </div>


            {/* USER NAME */}

            <span className="font-medium text-gray-800">

              {userName}

            </span>


            {/* ARROW */}

            <ChevronDown
              size={18}
              className={`text-gray-600 transition-transform ${
                showDropdown
                  ? "rotate-180"
                  : ""
              }`}
            />

          </button>


          {/* DROPDOWN MENU */}

          {showDropdown && (

            <div className="absolute right-0 mt-3 w-52 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">

              {/* PROFILE */}

              <button
                onClick={handleProfile}
                className="w-full flex items-center gap-3 px-5 py-3 text-left text-gray-700 hover:bg-gray-50 transition"
              >

                <User
                  size={18}
                  className="text-blue-600"
                />

                <span>
                  Profile
                </span>

              </button>


              {/* SETTINGS */}

              <button
                onClick={handleSettings}
                className="w-full flex items-center gap-3 px-5 py-3 text-left text-gray-700 hover:bg-gray-50 transition"
              >

                <Settings
                  size={18}
                  className="text-blue-600"
                />

                <span>
                  Settings
                </span>

              </button>


              {/* DIVIDER */}

              <div className="border-t border-gray-200" />


              {/* LOGOUT */}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-3 text-left text-red-600 hover:bg-red-50 transition"
              >

                <LogOut size={18} />

                <span>
                  Log Out
                </span>

              </button>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default DashboardNavbar;