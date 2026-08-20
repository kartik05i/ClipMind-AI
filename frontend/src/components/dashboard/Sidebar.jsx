import {
  LayoutDashboard,
  Brain,
  Video,
  BookOpen,
  Bookmark,
  Upload,
  BarChart3,
  FileText,
  Users,
  Settings,
  Activity,
  Cpu,
  ClipboardList,
  FolderCog,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const Sidebar = () => {
  // Get logged-in user
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const role = user.role;

  // ================= ROLE-BASED MENUS =================

  const roleMenus = {
    // ================= LEARNER =================

    Learner: [
      {
        name: "My Videos",
        path: "/my-videos",
        icon: <Video size={20} />,
      },
      {
        name: "Content Insights",
        path: "/content-insights",
        icon: <Brain size={20} />,
      },
      {
        name: "Learning History",
        path: "/learning-history",
        icon: <BookOpen size={20} />,
      },
      {
        name: "Bookmarks",
        path: "/bookmarks",
        icon: <Bookmark size={20} />,
      },
    ],

    // ================= EDUCATOR =================

    Educator: [
      {
        name: "Upload Video",
        path: "/upload",
        icon: <Upload size={20} />,
      },
      {
        name: "Manage Videos",
        path: "/manage-videos",
        icon: <FolderCog size={20} />,
      },
      {
        name: "Content Insights",
        path: "/content-insights",
        icon: <Brain size={20} />,
      },
      {
        name: "Learning Materials",
        path: "/learning-materials",
        icon: <FileText size={20} />,
      },
      {
        name: "Classroom Analytics",
        path: "/classroom-analytics",
        icon: <BarChart3 size={20} />,
      },
      {
        name: "Upload History",
        path: "/upload-history",
        icon: <BookOpen size={20} />,
      },
    ],

    // ================= CONTENT CREATOR =================

    "Content Creator": [
      {
        name: "Upload Video",
        path: "/upload",
        icon: <Upload size={20} />,
      },
      {
        name: "Manage Videos",
        path: "/manage-videos",
        icon: <FolderCog size={20} />,
      },
      {
        name: "Content Insights",
        path: "/content-insights",
        icon: <Brain size={20} />,
      },
      {
        name: "Content Analytics",
        path: "/content-analytics",
        icon: <BarChart3 size={20} />,
      },
      {
        name: "Upload History",
        path: "/upload-history",
        icon: <BookOpen size={20} />,
      },
    ],

    // ================= ADMINISTRATOR =================

    Administrator: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard size={20} />,
      },
      {
        name: "User Management",
        path: "/user-management",
        icon: <Users size={20} />,
      },
      {
        name: "Manage Videos",
        path: "/manage-videos",
        icon: <FolderCog size={20} />,
      },
      {
        name: "Content Insights",
        path: "/content-insights",
        icon: <Brain size={20} />,
      },
      {
        name: "Usage Reports",
        path: "/usage-reports",
        icon: <ClipboardList size={20} />,
      },
      {
        name: "System Analytics",
        path: "/system-analytics",
        icon: <Activity size={20} />,
      },
      {
        name: "Audit Logs",
        path: "/audit-logs",
        icon: <FileText size={20} />,
      },
      {
        name: "Platform Settings",
        path: "/platform-settings",
        icon: <Settings size={20} />,
      },
    ],
  };

  // Get menu for the current user's role
  const menus = roleMenus[role] || [];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200">
      <div className="mt-8 flex flex-col gap-2 px-4">
        {menus.map((menu) => (
          <NavLink
            key={menu.name}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            {menu.icon}

            <span>{menu.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;