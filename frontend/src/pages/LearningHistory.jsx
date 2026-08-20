import { useEffect, useState } from "react";
import { History, Video, Clock } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import { getLearningHistory } from "../services/learningHistoryService";

const LearningHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getLearningHistory();
      setHistory(data);
    } catch (error) {
      console.error("Failed to load learning history:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Unknown";

    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[500px]">
          <h2 className="text-xl font-semibold">
            Loading learning history...
          </h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Learning History
          </h1>

          <p className="text-gray-500 mt-2">
            Track your learning activity and viewed content.
          </p>
        </div>

        {history.length === 0 ? (

          <div className="bg-white border rounded-xl p-12 text-center">

            <History
              size={50}
              className="mx-auto text-gray-400 mb-4"
            />

            <h2 className="text-xl font-semibold text-gray-800">
              No learning history yet
            </h2>

            <p className="text-gray-500 mt-2">
              Start exploring videos and content insights to build your learning history.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {history.map((item) => (

              <div
                key={item.history_id}
                className="bg-white border rounded-xl p-6 shadow-sm flex items-center justify-between"
              >

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Video
                      size={24}
                      className="text-blue-600"
                    />
                  </div>

                  <div>

                    <h2 className="text-lg font-bold text-gray-900">
                      {item.video_title}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      {item.activity}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">

                  <Clock size={16} />

                  <span>
                    {formatDate(item.created_at)}
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </DashboardLayout>
  );
};

export default LearningHistory;