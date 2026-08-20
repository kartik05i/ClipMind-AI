import { useEffect, useState } from "react";

import {
  Users,
  Shield,
  UserCheck,
  UserX,
  RefreshCw,
  Trash2,
} from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";

import api from "../services/api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= FETCH USERS =================

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/users");

      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);

      alert(
        error.response?.data?.detail ||
          "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE ROLE =================

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.put(
        `/admin/users/${userId}/role`,
        null,
        {
          params: {
            role: newRole,
          },
        }
      );

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                role: newRole,
              }
            : user
        )
      );

      alert("User role updated successfully");
    } catch (error) {
      console.error("Failed to update role:", error);

      alert(
        error.response?.data?.detail ||
          "Failed to update user role"
      );

      fetchUsers();
    }
  };

  // ================= UPDATE STATUS =================

  const updateUserStatus = async (
    userId,
    currentStatus
  ) => {
    try {
      const newStatus = !currentStatus;

      await api.put(
        `/admin/users/${userId}/status`,
        null,
        {
          params: {
            is_active: newStatus,
          },
        }
      );

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                is_active: newStatus,
              }
            : user
        )
      );

      alert(
        newStatus
          ? "User activated successfully"
          : "User deactivated successfully"
      );
    } catch (error) {
      console.error(
        "Failed to update status:",
        error
      );

      alert(
        error.response?.data?.detail ||
          "Failed to update user status"
      );
    }
  };

  // ================= DELETE USER =================

  const deleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/admin/users/${userId}`
      );

      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user.id !== userId
        )
      );

      alert("User deleted successfully");
    } catch (error) {
      console.error(
        "Failed to delete user:",
        error
      );

      alert(
        error.response?.data?.detail ||
          "Failed to delete user"
      );
    }
  };

  // ================= STATISTICS =================

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.is_active
  ).length;

  const inactiveUsers = users.filter(
    (user) => !user.is_active
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= NAVBAR ================= */}

      <DashboardNavbar />

      {/* ================= SIDEBAR + CONTENT ================= */}

      <div className="flex">

        {/* SIDEBAR */}

        <Sidebar />

        {/* MAIN CONTENT */}

        <main className="flex-1 min-w-0 p-8">

          {/* ================= HEADER ================= */}

          <div className="flex items-start justify-between mb-8">

            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                User Management
              </h1>

              <p className="text-gray-500 mt-2 text-lg">
                Manage platform users, roles, and account status.
              </p>
            </div>

            <button
              onClick={fetchUsers}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition"
            >
              <RefreshCw
                size={20}
                className={
                  loading ? "animate-spin" : ""
                }
              />

              {loading
                ? "Refreshing..."
                : "Refresh"}
            </button>

          </div>

          {/* ================= STATISTICS ================= */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            {/* TOTAL USERS */}

            <div className="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-gray-500 text-lg">
                    Total Users
                  </p>

                  <h2 className="text-4xl font-bold text-gray-900 mt-3">
                    {totalUsers}
                  </h2>
                </div>

                <Users
                  size={38}
                  className="text-blue-600"
                />

              </div>

            </div>

            {/* ACTIVE USERS */}

            <div className="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-gray-500 text-lg">
                    Active Users
                  </p>

                  <h2 className="text-4xl font-bold text-green-600 mt-3">
                    {activeUsers}
                  </h2>
                </div>

                <UserCheck
                  size={38}
                  className="text-green-600"
                />

              </div>

            </div>

            {/* INACTIVE USERS */}

            <div className="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-gray-500 text-lg">
                    Inactive Users
                  </p>

                  <h2 className="text-4xl font-bold text-red-600 mt-3">
                    {inactiveUsers}
                  </h2>
                </div>

                <UserX
                  size={38}
                  className="text-red-600"
                />

              </div>

            </div>

          </div>

          {/* ================= USERS TABLE ================= */}

          <div className="bg-white border border-gray-300 rounded-2xl shadow-sm overflow-hidden">

            {/* TABLE TITLE */}

            <div className="flex items-center gap-3 p-6 border-b border-gray-300">

              <Shield
                size={25}
                className="text-blue-600"
              />

              <h2 className="text-2xl font-semibold text-gray-800">
                All Users
              </h2>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                {/* TABLE HEAD */}

                <thead className="border-b border-gray-300">

                  <tr className="text-left text-gray-800">

                    <th className="px-6 py-5">
                      ID
                    </th>

                    <th className="px-6 py-5">
                      Name
                    </th>

                    <th className="px-6 py-5">
                      Email
                    </th>

                    <th className="px-6 py-5">
                      Role
                    </th>

                    <th className="px-6 py-5">
                      Status
                    </th>

                    <th className="px-6 py-5">
                      Actions
                    </th>

                  </tr>

                </thead>

                {/* TABLE BODY */}

                <tbody>

                  {users.map((user) => (

                    <tr
                      key={user.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >

                      {/* ID */}

                      <td className="px-6 py-5">
                        {user.id}
                      </td>

                      {/* NAME */}

                      <td className="px-6 py-5 font-medium text-gray-800">
                        {user.name}
                      </td>

                      {/* EMAIL */}

                      <td className="px-6 py-5 text-gray-500">
                        {user.email}
                      </td>

                      {/* ROLE */}

                      <td className="px-6 py-5">

                        {user.role === "Administrator" ? (

                          <span className="inline-flex px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-medium">
                            Administrator
                          </span>

                        ) : (

                          <select
                            value={user.role}
                            onChange={(event) =>
                              updateUserRole(
                                user.id,
                                event.target.value
                              )
                            }
                            className="border border-gray-300 rounded-lg px-4 py-2 bg-white cursor-pointer"
                          >

                            {/* Current role */}

                            <option value={user.role}>
                              {user.role}
                            </option>

                            {/* Only promotion allowed */}

                            <option value="Administrator">
                              Administrator
                            </option>

                          </select>

                        )}

                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">

                        {user.is_active ? (

                          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium">
                            Active
                          </span>

                        ) : (

                          <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-medium">
                            Inactive
                          </span>

                        )}

                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          {/* ACTIVATE / DEACTIVATE */}

                          <button
                            onClick={() =>
                              updateUserStatus(
                                user.id,
                                user.is_active
                              )
                            }
                            className={`px-4 py-2 rounded-lg text-white transition ${
                              user.is_active
                                ? "bg-orange-500 hover:bg-orange-600"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          >

                            {user.is_active
                              ? "Deactivate"
                              : "Activate"}

                          </button>

                          {/* DELETE */}

                          <button
                            onClick={() =>
                              deleteUser(user.id)
                            }
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                          >

                            <Trash2 size={20} />

                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
};

export default ManageUsers;