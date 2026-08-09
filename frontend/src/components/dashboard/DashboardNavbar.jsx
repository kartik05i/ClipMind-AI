import { Bell } from "lucide-react";

const DashboardNavbar = () => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
      <h1 className="text-2xl font-bold text-blue-600">
        ClipMind AI
      </h1>

      <div className="flex items-center gap-6">
        <Bell className="cursor-pointer text-gray-600 hover:text-blue-600" />

        <button className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
            K
          </div>

          <span className="font-medium">Kartik</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardNavbar;