import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import { getAuditLogs } from "../services/auditLogsService";


const AuditLogs = () => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");


  useEffect(() => {
    loadAuditLogs();
  }, [search, category]);


  const loadAuditLogs = async () => {

    try {

      setLoading(true);

      const result = await getAuditLogs(
        search,
        category
      );

      setData(result);

    } catch (error) {

      console.error(
        "Failed to load audit logs:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  if (loading && !data) {

    return (

      <DashboardLayout>

        <div className="flex justify-center items-center h-[500px]">

          <h2 className="text-xl font-semibold">
            Loading Audit Logs...
          </h2>

        </div>

      </DashboardLayout>

    );

  }


  return (

    <DashboardLayout>

      <div className="max-w-7xl mx-auto">


        {/* ================= PAGE HEADER ================= */}

        <h1 className="text-4xl font-bold">
          Audit Logs
        </h1>

        <p className="text-gray-500 mt-2 mb-8">
          Monitor important activities and changes across the platform.
        </p>



        {/* ================= OVERVIEW CARDS ================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">


          {/* Total Activities */}

          <div className="bg-white rounded-xl border shadow-sm p-6">

            <p className="text-gray-500 text-sm">
              Total Activities
            </p>

            <h3 className="text-3xl font-bold mt-3">

              {data?.overview?.total_activities ?? 0}

            </h3>

          </div>



          {/* User Activities */}

          <div className="bg-white rounded-xl border shadow-sm p-6">

            <p className="text-gray-500 text-sm">
              User Activities
            </p>

            <h3 className="text-3xl font-bold mt-3">

              {data?.overview?.user_activities ?? 0}

            </h3>

          </div>



          {/* Content Activities */}

          <div className="bg-white rounded-xl border shadow-sm p-6">

            <p className="text-gray-500 text-sm">
              Content Activities
            </p>

            <h3 className="text-3xl font-bold mt-3">

              {data?.overview?.content_activities ?? 0}

            </h3>

          </div>



          {/* Admin Activities */}

          <div className="bg-white rounded-xl border shadow-sm p-6">

            <p className="text-gray-500 text-sm">
              Admin Activities
            </p>

            <h3 className="text-3xl font-bold mt-3">

              {data?.overview?.admin_activities ?? 0}

            </h3>

          </div>

        </div>



        {/* ================= SEARCH + FILTER ================= */}

        <div className="flex flex-col md:flex-row gap-4 mb-8">


          {/* Search */}

          <input
            type="text"
            placeholder="Search audit logs..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              w-full
              md:w-96
              px-4
              py-3
              border
              rounded-lg
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />



          {/* Category Filter */}

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="
              px-4
              py-3
              border
              rounded-lg
              bg-white
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >

            <option value="All">
              All Categories
            </option>

            <option value="User">
              User
            </option>

            <option value="Video">
              Video
            </option>

            <option value="Content">
              Content
            </option>

            <option value="Admin">
              Admin
            </option>

          </select>

        </div>



        {/* ================= AUDIT LOGS TABLE ================= */}

        <div className="bg-white rounded-xl border shadow-sm p-6">


          <h2 className="text-2xl font-bold mb-6">
            Recent Activities
          </h2>


          <div className="overflow-x-auto">


            <table className="w-full">


              <thead>

                <tr className="border-b">

                  <th className="text-left pb-4 text-gray-500">
                    Time
                  </th>

                  <th className="text-left pb-4 text-gray-500">
                    User
                  </th>

                  <th className="text-left pb-4 text-gray-500">
                    Action
                  </th>

                  <th className="text-left pb-4 text-gray-500">
                    Category
                  </th>

                  <th className="text-left pb-4 text-gray-500">
                    Details
                  </th>

                </tr>

              </thead>



              <tbody>


                {data?.logs?.length > 0 ? (

                  data.logs.map((log) => (

                    <tr
                      key={log.id}
                      className="border-b last:border-b-0"
                    >


                      {/* Time */}

                      <td className="py-4 text-gray-600 whitespace-nowrap">

                        {log.time
                          ? new Date(
                              log.time
                            ).toLocaleString()
                          : "N/A"}

                      </td>



                      {/* User */}

                      <td className="py-4 font-medium">

                        {log.user || "System"}

                      </td>



                      {/* Action */}

                      <td className="py-4">

                        <span className="font-medium">

                          {log.action}

                        </span>

                      </td>



                      {/* Category */}

                      <td className="py-4">

                        {log.category || "N/A"}

                      </td>



                      {/* Details */}

                      <td className="py-4 text-gray-600">

                        {log.details || "No details available"}

                      </td>


                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center text-gray-500 py-8"
                    >

                      No audit logs found.

                    </td>

                  </tr>

                )}


              </tbody>

            </table>

          </div>

        </div>


      </div>

    </DashboardLayout>

  );

};


export default AuditLogs;