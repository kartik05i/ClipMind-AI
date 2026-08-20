import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import { getSystemAnalytics } from "../services/systemAnalyticsService";


const SystemAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loadSystemAnalytics();
  }, []);


  const loadSystemAnalytics = async () => {
    try {
      const result = await getSystemAnalytics();

      setData(result);

    } catch (error) {
      console.error("Failed to load system analytics:", error);

    } finally {
      setLoading(false);
    }
  };


  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) {
      return "0 MB";
    }

    const mb = bytes / (1024 * 1024);

    return `${mb.toFixed(2)} MB`;
  };


  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[500px]">

          <h2 className="text-xl font-semibold">
            Loading System Analytics...
          </h2>

        </div>
      </DashboardLayout>
    );
  }


  if (!data) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">

          <div className="bg-white rounded-xl border shadow-sm p-8">

            <h2 className="text-2xl font-bold">
              Unable to load System Analytics
            </h2>

            <p className="text-gray-500 mt-2">
              Please try again later.
            </p>

          </div>

        </div>
      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout>

      <div className="max-w-7xl mx-auto">

        {/* Page Header */}

        <h1 className="text-4xl font-bold">
          System Analytics
        </h1>

        <p className="text-gray-500 mt-2 mb-8">
          Monitor platform health and storage utilization.
        </p>


        {/* System Status */}

        <h2 className="text-2xl font-bold mb-5">
          System Status
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          {/* Backend */}

          <div className="bg-white rounded-xl border shadow-sm p-6">

            <p className="text-gray-500 text-sm">
              Backend Status
            </p>

            <h3 className="text-2xl font-bold mt-3 text-green-600">
              {data.system_status?.backend || "Unavailable"}
            </h3>

          </div>


          {/* Database */}

          <div className="bg-white rounded-xl border shadow-sm p-6">

            <p className="text-gray-500 text-sm">
              Database Status
            </p>

            <h3 className="text-2xl font-bold mt-3 text-green-600">
              {data.system_status?.database || "Unavailable"}
            </h3>

          </div>


          {/* AI Service */}

          <div className="bg-white rounded-xl border shadow-sm p-6">

            <p className="text-gray-500 text-sm">
              AI Service Status
            </p>

            <h3 className="text-2xl font-bold mt-3 text-green-600">
              {data.system_status?.ai_service || "Unavailable"}
            </h3>

          </div>


          {/* Storage */}

          <div className="bg-white rounded-xl border shadow-sm p-6">

            <p className="text-gray-500 text-sm">
              Storage Status
            </p>

            <h3 className="text-2xl font-bold mt-3 text-green-600">
              {data.system_status?.storage || "Unavailable"}
            </h3>

          </div>

        </div>


        {/* Storage Overview */}

        <h2 className="text-2xl font-bold mb-5">
          Storage Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">


          <div className="bg-white rounded-xl border shadow-sm p-6">

            <p className="text-gray-500 text-sm">
              Total Storage Used
            </p>

            <h3 className="text-3xl font-bold mt-3">
              {formatFileSize(
                data.storage_overview?.total_storage
              )}
            </h3>

          </div>


          <div className="bg-white rounded-xl border shadow-sm p-6">

            <p className="text-gray-500 text-sm">
              Total Videos Stored
            </p>

            <h3 className="text-3xl font-bold mt-3">
              {data.storage_overview?.total_videos ?? 0}
            </h3>

          </div>


          <div className="bg-white rounded-xl border shadow-sm p-6">

            <p className="text-gray-500 text-sm">
              Average Video Size
            </p>

            <h3 className="text-3xl font-bold mt-3">
              {formatFileSize(
                data.storage_overview?.average_video_size
              )}
            </h3>

          </div>


          <div className="bg-white rounded-xl border shadow-sm p-6">

            <p className="text-gray-500 text-sm">
              Largest Video Size
            </p>

            <h3 className="text-3xl font-bold mt-3">
              {formatFileSize(
                data.storage_overview?.largest_video_size
              )}
            </h3>

          </div>

        </div>


        {/* Largest Uploaded Videos */}

        <div className="bg-white rounded-xl border shadow-sm p-6">

          <h2 className="text-2xl font-bold mb-6">
            Largest Uploaded Videos
          </h2>


          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left pb-4 text-gray-500">
                    Video
                  </th>

                  <th className="text-left pb-4 text-gray-500">
                    Uploaded By
                  </th>

                  <th className="text-left pb-4 text-gray-500">
                    File Size
                  </th>

                  <th className="text-left pb-4 text-gray-500">
                    Uploaded On
                  </th>

                </tr>

              </thead>


              <tbody>

                {data.largest_videos?.length > 0 ? (

                  data.largest_videos.map((video) => (

                    <tr
                      key={video.id}
                      className="border-b last:border-b-0"
                    >

                      <td className="py-4 font-medium">
                        {video.title}
                      </td>


                      <td className="py-4 text-gray-600">
                        {video.uploaded_by}
                      </td>


                      <td className="py-4">
                        {formatFileSize(video.file_size)}
                      </td>


                      <td className="py-4 text-gray-600">
                        {video.uploaded_at
                          ? new Date(
                              video.uploaded_at
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="4"
                      className="text-center text-gray-500 py-8"
                    >
                      No videos available.
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


export default SystemAnalytics;