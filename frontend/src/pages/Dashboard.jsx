import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import { getDashboardAnalytics } from "../services/dashboardAnalyticsService";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const result = await getDashboardAnalytics();

      setData(result);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 403) {
        setAccessDenied(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[500px]">
          <h2 className="text-xl font-semibold">
            Loading Dashboard...
          </h2>
        </div>
      </DashboardLayout>
    );
  }

  if (accessDenied) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">
            Welcome to ClipMind AI
          </h1>

          <p className="text-gray-500 mt-2 mb-8">
            Access your personalized learning and content features.
          </p>

          <div className="bg-white rounded-xl border shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-3">
              Your Dashboard
            </h2>

            <p className="text-gray-600">
              Platform analytics are available only to authorized roles.
              Please use the available features from the sidebar.
            </p>
          </div>
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
              Unable to load dashboard
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

        <h1 className="text-4xl font-bold">
          Analytics Dashboard
        </h1>

        <p className="text-gray-500 mt-2 mb-8">
          Monitor AI processing statistics and platform performance.
        </p>


        {/* Overview Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          <div className="bg-white rounded-xl border shadow-sm p-6">

            <p className="text-gray-500 text-sm">
              Total Videos
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {data.overview?.total_videos ?? 0}
            </h2>

          </div>


          <div className="bg-white rounded-xl border shadow-sm p-6">

            <p className="text-gray-500 text-sm">
              Total Transcripts
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {data.overview?.total_transcripts ?? 0}
            </h2>

          </div>


          <div className="bg-white rounded-xl border shadow-sm p-6">

            <p className="text-gray-500 text-sm">
              Total Summaries
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {data.overview?.total_summaries ?? 0}
            </h2>

          </div>


          <div className="bg-white rounded-xl border shadow-sm p-6">

            <p className="text-gray-500 text-sm">
              Success Rate
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {data.usage_report?.success_rate ?? 0}%
            </h2>

          </div>

        </div>


        {/* Insights and Processing */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          <div className="bg-white rounded-xl border shadow-sm p-6">

            <h2 className="text-2xl font-bold mb-6">
              Content Insights
            </h2>

            <div className="space-y-6">

              <div className="flex justify-between">

                <span className="text-gray-600">
                  Average Transcript Words
                </span>

                <span className="font-bold">
                  {data.content_insights?.average_transcript_words ?? 0}
                </span>

              </div>


              <div className="flex justify-between">

                <span className="text-gray-600">
                  Average Summary Words
                </span>

                <span className="font-bold">
                  {data.content_insights?.average_summary_words ?? 0}
                </span>

              </div>

            </div>

          </div>


          <div className="bg-white rounded-xl border shadow-sm p-6">

            <h2 className="text-2xl font-bold mb-6">
              Processing Statistics
            </h2>

            <div className="space-y-6">

              <div className="flex justify-between">

                <span className="text-gray-600">
                  Completed
                </span>

                <span className="font-bold text-green-600">
                  {data.usage_report?.completed_processing ?? 0}
                </span>

              </div>


              <div className="flex justify-between">

                <span className="text-gray-600">
                  Pending
                </span>

                <span className="font-bold text-yellow-600">
                  {data.usage_report?.pending_processing ?? 0}
                </span>

              </div>


              <div className="flex justify-between">

                <span className="text-gray-600">
                  Failed
                </span>

                <span className="font-bold text-red-600">
                  {data.usage_report?.failed_processing ?? 0}
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* Latest Video */}

        <div className="bg-white rounded-xl border shadow-sm p-6">

          <h2 className="text-2xl font-bold mb-6">
            Latest Uploaded Video
          </h2>

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Latest Video
              </p>

              <h3 className="text-2xl font-bold mt-2">
                {data.overview?.latest_video || "No videos uploaded"}
              </h3>

            </div>


            <div className="text-right">

              <p className="text-gray-500 text-sm">
                Dashboard Status
              </p>

              <span className="inline-block mt-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
                Active
              </span>

            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;