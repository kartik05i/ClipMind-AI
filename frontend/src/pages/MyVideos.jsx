import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video, Calendar, User } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);

      const response = await api.get("/videos/");

      setVideos(response.data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
        "Failed to load videos"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewInsights = (video) => {
    navigate("/content-insights", {
      state: {
        videoId: video.video_id,
      },
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[500px]">
          <h2 className="text-xl font-semibold">
            Loading videos...
          </h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            My Videos
          </h1>

          <p className="text-gray-500 mt-2">
            Explore uploaded videos and their AI-generated content.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* No Videos */}
        {!error && videos.length === 0 && (
          <div className="bg-white border rounded-xl p-10 text-center">
            <Video
              size={50}
              className="mx-auto text-gray-400 mb-4"
            />

            <h2 className="text-xl font-semibold text-gray-800">
              No videos available
            </h2>

            <p className="text-gray-500 mt-2">
              There are currently no uploaded videos to view.
            </p>
          </div>
        )}

        {/* Videos Grid */}
        {videos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {videos.map((video) => (
              <div
                key={video.video_id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              >

                {/* Video Icon Area */}
                <div className="h-40 bg-blue-50 flex items-center justify-center">
                  <Video
                    size={55}
                    className="text-blue-600"
                  />
                </div>

                {/* Video Details */}
                <div className="p-5">

                  <h2 className="text-xl font-bold text-gray-900 truncate">
                    {video.title}
                  </h2>

                  <p className="text-sm text-gray-500 mt-2 truncate">
                    {video.filename}
                  </p>

                  {/* Status */}
                  <div className="mt-4">
                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      {video.status}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                    <Calendar size={16} />

                    <span>
                      {new Date(
                        video.uploaded_at
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Uploaded By */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                    <User size={16} />

                    <span>
                      Uploaded by User #{video.uploaded_by}
                    </span>
                  </div>

                  {/* View Button */}
                  <button
                    onClick={() => handleViewInsights(video)}
                    className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition"
                  >
                    View Insights
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default MyVideos;