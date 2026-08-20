import { useEffect, useState } from "react";
import {
  Video,
  Calendar,
  User,
  Trash2,
  Eye,
  Search,
  Pencil,
  EyeOff,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

const ManageVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [editingVideo, setEditingVideo] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const role = user.role;

  useEffect(() => {
    loadVideos();
  }, []);

  // ================= LOAD VIDEOS =================

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError("");

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

  // ================= DELETE VIDEO =================

  const handleDelete = async (videoId) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this video?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      await api.delete(
        `/videos/${videoId}`
      );

      setVideos((currentVideos) =>
        currentVideos.filter(
          (video) =>
            (video.video_id || video.id) !== videoId
        )
      );

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
        "Failed to delete video"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ================= HIDE / UNHIDE VIDEO =================

  const handleToggleHide = async (videoId) => {
    try {
      setActionLoading(true);

      const response = await api.patch(
        `/videos/${videoId}/visibility`
      );

      const updatedHiddenStatus =
        response.data.is_hidden;

      setVideos((currentVideos) =>
        currentVideos.map((video) => {
          const currentVideoId =
            video.video_id || video.id;

          if (currentVideoId === videoId) {
            return {
              ...video,
              is_hidden: updatedHiddenStatus,
            };
          }

          return video;
        })
      );

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
        "Failed to update video visibility"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ================= OPEN EDIT MODAL =================

  const handleEditClick = (video) => {
    setEditingVideo(video);

    setEditedTitle(
      video.title || ""
    );
  };

  // ================= SAVE EDIT =================

  const handleSaveEdit = async () => {
    if (!editedTitle.trim()) {
      alert("Video title cannot be empty.");
      return;
    }

    const videoId =
      editingVideo.video_id ||
      editingVideo.id;

    try {
      setActionLoading(true);

      const formData = new FormData();

      formData.append(
        "title",
        editedTitle.trim()
      );

      const response = await api.put(
        `/videos/${videoId}`,
        formData
      );

      setVideos((currentVideos) =>
        currentVideos.map((video) => {
          const currentVideoId =
            video.video_id || video.id;

          if (currentVideoId === videoId) {
            return {
              ...video,
              title: response.data.title,
            };
          }

          return video;
        })
      );

      setEditingVideo(null);
      setEditedTitle("");

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
        "Failed to update video"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ================= FILTER VIDEOS =================

  const filteredVideos = videos.filter((video) => {
    const searchValue =
      searchTerm.toLowerCase();

    const matchesSearch =
      video.title
        ?.toLowerCase()
        .includes(searchValue) ||
      video.filename
        ?.toLowerCase()
        .includes(searchValue);

    if (statusFilter === "All") {
      return matchesSearch;
    }

    if (statusFilter === "Visible") {
      return (
        matchesSearch &&
        !video.is_hidden
      );
    }

    if (statusFilter === "Hidden") {
      return (
        matchesSearch &&
        video.is_hidden
      );
    }

    return (
      matchesSearch &&
      video.status === statusFilter
    );
  });

  // ================= LOADING =================

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

        {/* ================= HEADING ================= */}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Manage Videos
          </h1>

          <p className="text-gray-500 mt-2">
            {role === "Administrator"
              ? "View and manage all uploaded videos across the platform."
              : "View and manage your uploaded videos."}
          </p>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* ================= SEARCH + FILTER ================= */}

        {!error && (
          <div className="flex flex-col md:flex-row gap-4 mb-8">

            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search by title or filename..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full border border-gray-300 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">
                All Videos
              </option>

              <option value="Visible">
                Visible
              </option>

              <option value="Hidden">
                Hidden
              </option>

              <option value="Uploaded">
                Uploaded
              </option>

              <option value="Processing">
                Processing
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Failed">
                Failed
              </option>
            </select>

          </div>
        )}

        {/* ================= NO VIDEOS ================= */}

        {!error && videos.length === 0 && (
          <div className="bg-white border rounded-xl p-10 text-center">

            <Video
              size={50}
              className="mx-auto text-gray-400 mb-4"
            />

            <h2 className="text-xl font-semibold text-gray-800">
              No videos found
            </h2>

            <p className="text-gray-500 mt-2">
              {role === "Administrator"
                ? "There are currently no uploaded videos on the platform."
                : "You have not uploaded any videos yet."}
            </p>

          </div>
        )}

        {/* ================= NO SEARCH RESULTS ================= */}

        {!error &&
          videos.length > 0 &&
          filteredVideos.length === 0 && (
            <div className="bg-white border rounded-xl p-10 text-center">

              <Search
                size={45}
                className="mx-auto text-gray-400 mb-4"
              />

              <h2 className="text-xl font-semibold text-gray-800">
                No matching videos found
              </h2>

              <p className="text-gray-500 mt-2">
                Try changing your search or filter.
              </p>

            </div>
          )}

        {/* ================= VIDEOS GRID ================= */}

        {filteredVideos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredVideos.map((video) => {
              const videoId =
                video.video_id || video.id;

              const isHidden =
                video.is_hidden || false;

              return (
                <div
                  key={videoId}
                  className={`bg-white border rounded-xl shadow-sm hover:shadow-md transition overflow-hidden ${
                    isHidden
                      ? "border-gray-300 opacity-70"
                      : "border-gray-200"
                  }`}
                >

                  <div className="h-40 bg-blue-50 flex items-center justify-center relative">

                    <Video
                      size={55}
                      className="text-blue-600"
                    />

                    {isHidden && (
                      <div className="absolute top-3 right-3 bg-gray-800 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <EyeOff size={14} />
                        Hidden
                      </div>
                    )}

                  </div>

                  <div className="p-5">

                    <h2 className="text-xl font-bold text-gray-900 truncate">
                      {video.title}
                    </h2>

                    <p className="text-sm text-gray-500 mt-2 truncate">
                      {video.filename}
                    </p>

                    <div className="mt-4">
                      <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        {video.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">

                      <Calendar size={16} />

                      <span>
                        {video.uploaded_at
                          ? new Date(
                              video.uploaded_at
                            ).toLocaleDateString()
                          : "Date unavailable"}
                      </span>

                    </div>

                    {role === "Administrator" && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">

                        <User size={16} />

                        <span>
                          Uploaded by User #
                          {video.uploaded_by}
                        </span>

                      </div>
                    )}

                    {/* ================= ACTION BUTTONS ================= */}

                    <div className="grid grid-cols-2 gap-3 mt-5">

                      <button
                        onClick={() =>
                          navigate(
                            `/content-insights?video=${videoId}`
                          )
                        }
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition"
                      >
                        <Eye size={17} />
                        Insights
                      </button>

                      <button
                        onClick={() =>
                          handleEditClick(video)
                        }
                        disabled={actionLoading}
                        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 py-2.5 rounded-lg font-medium transition"
                      >
                        <Pencil size={17} />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleToggleHide(videoId)
                        }
                        disabled={actionLoading}
                        className="flex items-center justify-center gap-2 bg-yellow-50 hover:bg-yellow-100 disabled:opacity-50 text-yellow-700 border border-yellow-200 py-2.5 rounded-lg font-medium transition"
                      >
                        {isHidden ? (
                          <>
                            <Eye size={17} />
                            Unhide
                          </>
                        ) : (
                          <>
                            <EyeOff size={17} />
                            Hide
                          </>
                        )}
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(videoId)
                        }
                        disabled={actionLoading}
                        className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 border border-red-200 py-2.5 rounded-lg font-medium transition"
                      >
                        <Trash2 size={17} />
                        Delete
                      </button>

                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        )}

        {/* ================= EDIT MODAL ================= */}

        {editingVideo && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">

              <button
                onClick={() =>
                  setEditingVideo(null)
                }
                disabled={actionLoading}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              >
                <X size={22} />
              </button>

              <h2 className="text-2xl font-bold text-gray-900">
                Edit Video
              </h2>

              <p className="text-gray-500 mt-2 mb-6">
                Update the video title.
              </p>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Title
              </label>

              <input
                type="text"
                value={editedTitle}
                onChange={(e) =>
                  setEditedTitle(e.target.value)
                }
                disabled={actionLoading}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-3 mt-6">

                <button
                  onClick={() =>
                    setEditingVideo(null)
                  }
                  disabled={actionLoading}
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-medium transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveEdit}
                  disabled={actionLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition"
                >
                  {actionLoading
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default ManageVideos;