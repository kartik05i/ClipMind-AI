import { useEffect, useState } from "react";

import Sidebar from "../components/dashboard/Sidebar";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";

import {
  FileText,
  ClipboardList,
  Brain,
  BookOpen,
  Sparkles,
  ChevronDown,
  Loader2,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

const LearningMaterials = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [activeMaterial, setActiveMaterial] = useState(null);

  const [loadingVideos, setLoadingVideos] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [notes, setNotes] = useState(null);
  const [flashcards, setFlashcards] = useState(null);
  const [quiz, setQuiz] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoadingVideos(true);

        const response = await fetch(`${API_URL}/videos/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }

        const data = await response.json();

        setVideos(data);

      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoadingVideos(false);
      }
    };

    fetchVideos();
  }, [token]);


  const generateMaterial = async (type) => {
    if (!selectedVideo) {
      alert("Please select a video first.");
      return;
    }

    try {
      setGenerating(true);
      setActiveMaterial(type);

      const response = await fetch(
        `${API_URL}/learning-materials/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            video_id: Number(selectedVideo),
            material_type: type,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate learning material");
      }

      const data = await response.json();

      if (type === "notes") {
        setNotes(data);
      }

      if (type === "flashcards") {
        setFlashcards(data);
      }

      if (type === "quiz") {
        setQuiz(data);
      }

    } catch (error) {
      console.error(error);
      alert("Failed to generate learning material.");
    } finally {
      setGenerating(false);
    }
  };


  const materials = [
    {
      id: "notes",
      name: "Study Notes",
      description:
        "Generate structured notes from the video transcript.",
      icon: <FileText size={22} />,
    },
    {
      id: "flashcards",
      name: "Flashcards",
      description:
        "Create flashcards for quick revision.",
      icon: <Brain size={22} />,
    },
    {
      id: "quiz",
      name: "Quiz",
      description:
        "Generate questions to test student understanding.",
      icon: <ClipboardList size={22} />,
    },
  ];


  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= NAVBAR ================= */}

      <DashboardNavbar />


      {/* ================= SIDEBAR + CONTENT ================= */}

      <div className="flex">

        {/* ================= SIDEBAR ================= */}

        <Sidebar />


        {/* ================= MAIN CONTENT ================= */}

        <main className="flex-1 min-w-0 p-8">

          {/* ================= HEADER ================= */}

          <div className="mb-8">

            <h1 className="text-4xl font-bold text-gray-900">
              Learning Materials
            </h1>

            <p className="mt-2 text-gray-500 text-lg">
              Create AI-powered learning resources from your uploaded videos.
            </p>

          </div>


          {/* ================= SELECT VIDEO ================= */}

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">

            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Video
            </label>

            <div className="relative">

              <select
                value={selectedVideo}
                onChange={(e) => {
                  setSelectedVideo(e.target.value);
                  setNotes(null);
                  setFlashcards(null);
                  setQuiz(null);
                  setActiveMaterial(null);
                }}
                className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  {loadingVideos
                    ? "Loading videos..."
                    : "Select an uploaded video"}
                </option>

                {videos.map((video) => (
                  <option
                    key={video.video_id}
                    value={video.video_id}
                  >
                    {video.title || video.filename}
                  </option>
                ))}

              </select>

              <ChevronDown
                size={20}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />

            </div>

          </div>


          {/* ================= MATERIAL OPTIONS ================= */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            {materials.map((material) => (

              <button
                key={material.id}
                onClick={() =>
                  generateMaterial(material.id)
                }
                disabled={generating}
                className={`text-left bg-white border rounded-xl p-6 transition-all duration-200 hover:shadow-md hover:border-blue-500 ${
                  activeMaterial === material.id
                    ? "border-blue-600 ring-2 ring-blue-100"
                    : "border-gray-200"
                }`}
              >

                <div className="flex items-center gap-3 mb-4">

                  <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    {material.icon}
                  </div>

                  <h2 className="text-lg font-semibold text-gray-900">
                    {material.name}
                  </h2>

                </div>

                <p className="text-sm text-gray-500 leading-relaxed">
                  {material.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-blue-600 text-sm font-medium">

                  <Sparkles size={16} />

                  Generate

                </div>

              </button>

            ))}

          </div>


          {/* ================= RESULTS ================= */}

          <div className="bg-white border border-gray-200 rounded-xl min-h-[400px] shadow-sm">

            {/* ================= LOADING ================= */}

            {generating && (

              <div className="min-h-[400px] flex flex-col items-center justify-center">

                <Loader2
                  size={40}
                  className="text-blue-600 animate-spin mb-4"
                />

                <h3 className="text-lg font-semibold text-gray-800">
                  Generating learning material...
                </h3>

                <p className="text-gray-500 mt-2">
                  AI is analyzing the transcript.
                </p>

              </div>

            )}


            {/* ================= EMPTY STATE ================= */}

            {!generating &&
              !notes &&
              !flashcards &&
              !quiz && (

                <div className="min-h-[400px] flex flex-col items-center justify-center text-center">

                  <div className="p-5 bg-blue-50 text-blue-600 rounded-full mb-5">

                    <BookOpen size={42} />

                  </div>

                  <h3 className="text-xl font-semibold text-gray-800">
                    Create Learning Materials
                  </h3>

                  <p className="text-gray-500 mt-2 max-w-md">
                    Select one of your uploaded videos and generate study
                    notes, flashcards, or quizzes from its transcript.
                  </p>

                </div>

              )}


            {/* ================= STUDY NOTES ================= */}

            {!generating &&
              activeMaterial === "notes" &&
              notes && (

                <div className="p-8">

                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Study Notes
                  </h2>

                  <div className="whitespace-pre-wrap text-gray-700">

                    {typeof notes === "string"
                      ? notes
                      : notes.content ||
                        notes.notes ||
                        JSON.stringify(notes, null, 2)}

                  </div>

                </div>

              )}


            {/* ================= FLASHCARDS ================= */}

            {!generating &&
              activeMaterial === "flashcards" &&
              flashcards && (

                <div className="p-8">

                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Flashcards
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {(flashcards.flashcards || flashcards).map(
                      (card, index) => (

                        <div
                          key={index}
                          className="border border-gray-200 rounded-xl p-5"
                        >

                          <p className="text-sm font-semibold text-blue-600 mb-2">
                            Question
                          </p>

                          <p className="font-semibold text-gray-900 mb-5">
                            {card.question ||
                              card.front ||
                              card.term}
                          </p>

                          <div className="border-t pt-4">

                            <p className="text-sm font-semibold text-green-600 mb-2">
                              Answer
                            </p>

                            <p className="text-gray-700">
                              {card.answer ||
                                card.back ||
                                card.definition}
                            </p>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}


            {/* ================= QUIZ ================= */}

            {!generating &&
              activeMaterial === "quiz" &&
              quiz && (

                <div className="p-8">

                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Generated Quiz
                  </h2>

                  <div className="space-y-6">

                    {(quiz.questions || quiz).map(
                      (question, index) => (

                        <div
                          key={index}
                          className="border border-gray-200 rounded-xl p-6"
                        >

                          <h3 className="font-semibold text-gray-900 mb-5">

                            {index + 1}.{" "}

                            {question.question ||
                              question.text}

                          </h3>

                          {question.options && (

                            <div className="space-y-3">

                              {question.options.map(
                                (option, optionIndex) => (

                                  <div
                                    key={optionIndex}
                                    className="border border-gray-200 rounded-lg px-4 py-3"
                                  >

                                    {String.fromCharCode(
                                      65 + optionIndex
                                    )}.{" "}

                                    {option}

                                  </div>

                                )
                              )}

                            </div>

                          )}

                          {question.answer && (

                            <div className="mt-5 bg-green-50 border border-green-100 rounded-lg p-4">

                              <span className="font-semibold text-green-700">
                                Correct Answer:
                              </span>

                              <span className="ml-2 text-green-800">
                                {question.answer}
                              </span>

                            </div>

                          )}

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}

          </div>

        </main>

      </div>

    </div>
  );
};

export default LearningMaterials;