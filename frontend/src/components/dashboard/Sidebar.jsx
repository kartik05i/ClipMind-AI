import {
  LayoutDashboard,
  Upload,
  Brain,
  FileText,
  Video,
  History,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menus = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    name: "Upload Video",
    path: "/upload",
    icon: <Upload size={20} />,
  },
  {
    name: "Content Insights",
    path: "/content-insights",
    icon: <Brain size={20} />,
  },
  {
    name: "Usage Reports",
    path: "/usage-reports",
    icon: <FileText size={20} />,
  },
  {
    name: "My Videos",
    path: "/my-videos",
    icon: <Video size={20} />,
  },
  {
    name: "Upload History",
    path: "/upload-history",
    icon: <History size={20} />,
  },
];

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