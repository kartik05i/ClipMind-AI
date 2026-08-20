import { useEffect, useState } from "react";

import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import Sidebar from "../components/dashboard/Sidebar";

import {
  Video,
  Activity,
  Users,
  Bookmark,
  BarChart3,
  Trophy,
  Loader2,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

const ContentAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/content-analytics/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch content analytics");
        }

        const data = await response.json();

        setAnalytics(data);
      } catch (error) {
        console.error(
          "Error fetching content analytics:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

  const overview = analytics?.overview || {};

  const overviewCards = [
    {
      title: "Total Videos",
      value: overview.total_videos || 0,
      icon: <Video size={24} />,
    },
    {
      title: "Total Activities",
      value: overview.total_activities || 0,
      icon: <Activity size={24} />,
    },
    {
      title: "Unique Learners",
      value: overview.unique_learners || 0,
      icon: <Users size={24} />,
    },
    {
      title: "Total Bookmarks",
      value: overview.total_bookmarks || 0,
      icon: <Bookmark size={24} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= NAVBAR ================= */}
      <DashboardNavbar />

      <div className="flex">

        {/* ================= SIDEBAR ================= */}
        <Sidebar />

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-1 min-w-0 p-8">

          {loading ? (
            <div className="flex min-h-[70vh] items-center justify-center">

              <div className="flex flex-col items-center">

                <Loader2
                  size={40}
                  className="animate-spin text-blue-600"
                />

                <p className="mt-4 text-gray-500">
                  Loading content analytics...
                </p>

              </div>

            </div>
          ) : (
            <>
              {/* ================= HEADER ================= */}

              <div className="mb-8">

                <h1 className="text-4xl font-bold text-gray-900">
                  Content Analytics
                </h1>

                <p className="mt-2 text-gray-500 text-lg">
                  Track how your content is performing and how learners engage
                  with it.
                </p>

              </div>

              {/* ================= OVERVIEW CARDS ================= */}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

                {overviewCards.map((card) => (

                  <div
                    key={card.title}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                  >

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-sm font-medium text-gray-500">
                          {card.title}
                        </p>

                        <h2 className="text-3xl font-bold text-gray-900 mt-2">
                          {card.value}
                        </h2>

                      </div>

                      <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                        {card.icon}
                      </div>

                    </div>

                  </div>

                ))}

              </div>

              {/* ================= TOP PERFORMING VIDEO ================= */}

              {analytics?.top_video && (

                <section className="bg-white border border-gray-200 rounded-xl shadow-sm mb-8 p-6">

                  <div className="flex items-start gap-4">

                    <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                      <Trophy size={28} />
                    </div>

                    <div className="flex-1">

                      <p className="text-sm font-medium text-gray-500">
                        Top Performing Content
                      </p>

                      <h2 className="text-2xl font-bold text-gray-900 mt-1">
                        {analytics.top_video.video_title}
                      </h2>

                      <div className="flex flex-wrap gap-6 mt-4 text-sm">

                        <span className="text-gray-600">

                          <strong className="text-gray-900">
                            {analytics.top_video.activities}
                          </strong>{" "}

                          Activities

                        </span>

                        <span className="text-gray-600">

                          <strong className="text-gray-900">
                            {analytics.top_video.unique_learners}
                          </strong>{" "}

                          Learners

                        </span>

                        <span className="text-gray-600">

                          <strong className="text-gray-900">
                            {analytics.top_video.bookmarks}
                          </strong>{" "}

                          Bookmarks

                        </span>

                      </div>

                    </div>

                  </div>

                </section>

              )}

              {/* ================= VIDEO PERFORMANCE ================= */}

              <section className="bg-white border border-gray-200 rounded-xl shadow-sm">

                <div className="p-6 border-b border-gray-200 flex items-center gap-3">

                  <BarChart3
                    size={22}
                    className="text-blue-600"
                  />

                  <div>

                    <h2 className="text-xl font-bold text-gray-900">
                      Video Performance
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Engagement analytics for each of your uploaded videos.
                    </p>

                  </div>

                </div>

                {analytics?.video_analytics?.length > 0 ? (

                  <div className="overflow-x-auto">

                    <table className="w-full">

                      <thead className="bg-gray-50 border-b">

                        <tr>

                          <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                            Video
                          </th>

                          <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                            Activities
                          </th>

                          <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                            Learners
                          </th>

                          <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                            Bookmarks
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {analytics.video_analytics.map((video) => (

                          <tr
                            key={video.video_id}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >

                            <td className="px-6 py-4 font-medium text-gray-800">
                              {video.video_title || "Untitled Video"}
                            </td>

                            <td className="text-center px-6 py-4 text-gray-600">
                              {video.activities}
                            </td>

                            <td className="text-center px-6 py-4 text-gray-600">
                              {video.unique_learners}
                            </td>

                            <td className="text-center px-6 py-4 text-gray-600">
                              {video.bookmarks}
                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                ) : (

                  <div className="p-12 text-center text-gray-500">
                    No content analytics available yet.
                  </div>

                )}

              </section>

            </>
          )}

        </main>

      </div>

    </div>
  );
};

export default ContentAnalytics;