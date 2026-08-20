import { useEffect, useState } from "react";

import {
  History,
  Video,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

const UploadHistory = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUploadHistory();
  }, []);

  const fetchUploadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/videos/");

      setVideos(response.data || []);
    } catch (error) {
      console.error(
        "Failed to fetch upload history:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Failed to load upload history."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Not available";
    }

    return new Date(dateString).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "success":
        return "bg-green-100 text-green-700";

      case "processing":
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "failed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "success":
        return <CheckCircle2 size={16} />;

      case "processing":
      case "pending":
        return <Clock size={16} />;

      case "failed":
        return <XCircle size={16} />;

      default:
        return <Clock size={16} />;
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
              Loading upload history...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Upload History
          </h1>

          <p className="mt-2 text-gray-500 text-lg">
            View and track all the videos you have uploaded.
          </p>
        </div>


        {/* ERROR MESSAGE */}

        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">
            <AlertCircle size={22} />

            <span>
              {error}
            </span>
          </div>
        )}


        {/* TOTAL UPLOADS */}

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4">

            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
              <Video size={28} />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Uploads
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-1">
                {videos.length}
              </h2>
            </div>

          </div>
        </div>


        {/* UPLOAD HISTORY TABLE */}

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          {/* SECTION HEADER */}

          <div className="p-6 border-b border-gray-200 flex items-center gap-3">

            <History
              size={24}
              className="text-blue-600"
            />

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Your Uploaded Videos
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Only videos uploaded by your account are shown here.
              </p>
            </div>

          </div>


          {/* VIDEOS */}

          {videos.length > 0 ? (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Video
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Uploaded On
                    </th>

                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                      Visibility
                    </th>

                  </tr>
                </thead>


                <tbody>

                  {videos.map((video) => (
                    <tr
                      key={video.video_id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >

                      {/* VIDEO */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <Video size={22} />
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900">
                              {video.title || "Untitled Video"}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              {video.filename || "No filename available"}
                            </p>
                          </div>

                        </div>

                      </td>


                      {/* UPLOAD DATE */}

                      <td className="px-6 py-5 text-gray-600">

                        <div className="flex items-center gap-2">

                          <Calendar
                            size={17}
                            className="text-gray-400"
                          />

                          {formatDate(video.uploaded_at)}

                        </div>

                      </td>


                      {/* STATUS */}

                      <td className="px-6 py-5 text-center">

                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                            video.status
                          )}`}
                        >
                          {getStatusIcon(video.status)}

                          {video.status || "Unknown"}

                        </span>

                      </td>


                      {/* VISIBILITY */}

                      <td className="px-6 py-5 text-center">

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            video.is_hidden
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {video.is_hidden
                            ? "Hidden"
                            : "Visible"}
                        </span>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          ) : (
            <div className="py-20 flex flex-col items-center text-center">

              <div className="p-5 bg-blue-50 rounded-full text-blue-600">
                <History size={40} />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mt-5">
                No uploads yet
              </h3>

              <p className="text-gray-500 mt-2">
                Videos uploaded from your account will appear here.
              </p>

            </div>
          )}

        </div>

      </div>
    </DashboardLayout>
  );
};

export default UploadHistory;