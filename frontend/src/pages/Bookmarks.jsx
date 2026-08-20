import { useEffect, useState } from "react";
import {
  Bookmark,
  Trash2,
  FileText,
  Sparkles,
  Clock,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";

import {
  getBookmarks,
  deleteBookmark,
} from "../services/bookmarkService";


const Bookmarks = () => {

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loadBookmarks();
  }, []);


  const loadBookmarks = async () => {

    try {

      const data = await getBookmarks();

      setBookmarks(data);

    } catch (error) {

      console.error(
        "Failed to load bookmarks:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  const handleDelete = async (bookmarkId) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bookmark?"
    );

    if (!confirmDelete) return;

    try {

      await deleteBookmark(bookmarkId);

      setBookmarks((previousBookmarks) =>
        previousBookmarks.filter(
          (bookmark) =>
            bookmark.bookmark_id !== bookmarkId
        )
      );

    } catch (error) {

      console.error(
        "Failed to delete bookmark:",
        error
      );

      alert("Failed to delete bookmark.");

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
            Loading bookmarks...
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

          <h1 className="text-4xl font-bold">
            Bookmarks
          </h1>

          <p className="text-gray-500 mt-2">
            Your saved summaries and highlights.
          </p>

        </div>


        {/* Empty State */}

        {bookmarks.length === 0 ? (

          <div className="bg-white border rounded-xl p-12 text-center">

            <Bookmark
              size={50}
              className="mx-auto text-gray-400 mb-4"
            />

            <h2 className="text-xl font-semibold">
              No bookmarks yet
            </h2>

            <p className="text-gray-500 mt-2">
              Bookmark summaries or highlights to access them later.
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {bookmarks.map((item) => (

              <div
                key={item.bookmark_id}
                className="bg-white border rounded-xl shadow-sm p-6"
              >

                {/* Top Section */}

                <div className="flex justify-between items-start mb-5">

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">

                      {item.content_type === "summary" ? (

                        <FileText
                          size={24}
                          className="text-blue-600"
                        />

                      ) : (

                        <Sparkles
                          size={24}
                          className="text-blue-600"
                        />

                      )}

                    </div>


                    <div>

                      <h2 className="text-xl font-bold">
                        {item.video_title}
                      </h2>

                      <p className="text-sm text-blue-600 font-medium mt-1">

                        {item.content_type === "summary"
                          ? "Bookmarked Summary"
                          : "Bookmarked Highlights"}

                      </p>

                    </div>

                  </div>


                  <button
                    onClick={() =>
                      handleDelete(item.bookmark_id)
                    }
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Delete bookmark"
                  >

                    <Trash2 size={20} />

                  </button>

                </div>


                {/* Bookmark Content */}

                <div className="bg-gray-50 border rounded-lg p-5 whitespace-pre-wrap text-gray-700 leading-7">

                  {item.content}

                </div>


                {/* Timestamp */}

                <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">

                  <Clock size={16} />

                  <span>
                    Saved on {formatDate(item.created_at)}
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


export default Bookmarks;