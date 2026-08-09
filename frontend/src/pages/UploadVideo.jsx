import { useState } from "react";
import { UploadCloud, FileVideo } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";

import { uploadVideo } from "../services/videoService";

import {
  generateTranscript,
  getTranscript,
} from "../services/transcriptService";

import {
  generateSummary,
  getSummary,
} from "../services/summaryService";

import { generateKeyMoments } from "../services/keyMomentService";
import { generateHighlights } from "../services/highlightService";
import { generateKeywords } from "../services/keywordService";

const UploadVideo = () => {

  // Upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [videoId, setVideoId] = useState(null);

  // Results
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [keyMoments, setKeyMoments] = useState([]);
  const [highlights, setHighlights] = useState("");
  const [keywords, setKeywords] = useState([]);

  // Active Tab
  const [activeTab, setActiveTab] = useState("");

  // Loading
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingKeyMoments, setLoadingKeyMoments] = useState(false);
  const [loadingHighlights, setLoadingHighlights] = useState(false);
  const [loadingKeywords, setLoadingKeywords] = useState(false);

  // Already Generated
  const [transcriptReady, setTranscriptReady] = useState(false);
  const [summaryReady, setSummaryReady] = useState(false);
  const [keyMomentsReady, setKeyMomentsReady] = useState(false);
  const [highlightsReady, setHighlightsReady] = useState(false);
  const [keywordsReady, setKeywordsReady] = useState(false);

  // ===========================
  // Upload
  // ===========================

  const handleUpload = async () => {

    if (!selectedFile) {
      alert("Please choose a video.");
      return;
    }

    try {

      setLoadingUpload(true);

      const response = await uploadVideo(
        selectedFile.name,
        selectedFile
      );

      setVideoId(response.video_id);
      setUploaded(true);

      alert("Video uploaded successfully.");

    } catch (err) {

      console.error(err);
      alert("Upload failed.");

    } finally {

      setLoadingUpload(false);

    }

  };

  // ===========================
  // Transcript
  // ===========================

  const handleTranscript = async () => {

    if (!videoId) return;

    setActiveTab("transcript");

    if (transcriptReady) return;

    try {

      setLoadingTranscript(true);

      await generateTranscript(videoId);

      const result = await getTranscript(videoId);

      setTranscript(result.transcript);

      setTranscriptReady(true);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingTranscript(false);

    }

  };

  // ===========================
  // Summary
  // ===========================

  const handleSummary = async () => {

    if (!videoId) return;

    setActiveTab("summary");

    if (summaryReady) return;

    try {

      setLoadingSummary(true);

      await generateSummary(videoId);

      const result = await getSummary(videoId);

      setSummary(result.summary);

      setSummaryReady(true);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingSummary(false);

    }

  };

  // ===========================
  // Key Moments
  // ===========================

  const handleKeyMoments = async () => {

    if (!videoId) return;

    setActiveTab("keymoments");

    if (keyMomentsReady) return;

    try {

      setLoadingKeyMoments(true);

      const result = await generateKeyMoments(videoId);

      setKeyMoments(result.key_moments || []);

      setKeyMomentsReady(true);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingKeyMoments(false);

    }

  };

  // ===========================
  // Highlights
  // ===========================

  const handleHighlights = async () => {

    if (!videoId) return;

    setActiveTab("highlights");

    if (highlightsReady) return;

    try {

      setLoadingHighlights(true);

      const result = await generateHighlights(videoId);

      setHighlights(result.highlight_report || "");

      setHighlightsReady(true);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingHighlights(false);

    }

  };

  // ===========================
  // Keywords
  // ===========================

  const handleKeywords = async () => {

    if (!videoId) return;

    setActiveTab("keywords");

    if (keywordsReady) return;

    try {

      setLoadingKeywords(true);

      const result = await generateKeywords(videoId);

      setKeywords(result.keywords || []);

      setKeywordsReady(true);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingKeywords(false);

    }

  };

  return (
        <DashboardLayout>

      <h1 className="text-3xl font-bold">
        Upload Video
      </h1>

      <p className="text-gray-500 mt-2">
        Upload your lecture or meeting video.
      </p>

      <div className="bg-white rounded-xl shadow mt-8 p-8">

        {/* Upload Area */}

        <div className="border-2 border-dashed border-blue-300 rounded-xl p-12 text-center">

          <UploadCloud
            size={60}
            className="mx-auto text-blue-600"
          />

          <h2 className="text-2xl font-semibold mt-4">
            Drag & Drop your video
          </h2>

          <p className="text-gray-500 mt-2">
            or choose a video from your computer
          </p>

          <label className="inline-block mt-6">

            <input
              hidden
              type="file"
              accept="video/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />

            <span className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
              Choose File
            </span>

          </label>

          {selectedFile && (

            <>
              <div className="mt-8 flex justify-center items-center gap-3">

                <FileVideo className="text-blue-600" />

                <span className="font-medium">
                  {selectedFile.name}
                </span>

              </div>

              <button
                onClick={handleUpload}
                disabled={loadingUpload}
                className="mt-6 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg"
              >
                {loadingUpload ? "Uploading..." : "Upload Video"}
              </button>

            </>

          )}

        </div>

        {uploaded && (

          <div className="mt-10">

            {/* Success Card */}

            <div className="bg-green-50 border border-green-300 rounded-lg p-4">

              <h2 className="font-bold text-green-700">
                 Upload Successful
              </h2>

              <p className="mt-1">
                {selectedFile?.name}
              </p>

            </div>

            {/* AI Tool Buttons */}

            <div className="flex flex-wrap gap-3 mt-8">

              <button
                onClick={handleTranscript}
                className={`px-5 py-2 rounded-lg transition ${
                  activeTab === "transcript"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Transcript
              </button>

              <button
                onClick={handleSummary}
                className={`px-5 py-2 rounded-lg transition ${
                  activeTab === "summary"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Summary
              </button>

              <button
                onClick={handleKeyMoments}
                className={`px-5 py-2 rounded-lg transition ${
                  activeTab === "keymoments"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Key Moments
              </button>

              <button
                onClick={handleHighlights}
                className={`px-5 py-2 rounded-lg transition ${
                  activeTab === "highlights"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Highlights
              </button>

              <button
                onClick={handleKeywords}
                className={`px-5 py-2 rounded-lg transition ${
                  activeTab === "keywords"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Keywords
              </button>

            </div>

            {/* Output Panel */}

            <div className="mt-8 border rounded-xl p-6 min-h-[350px]">
                            {activeTab === "" && (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold">
                      Select an AI Tool
                    </h2>
                    <p className="mt-2">
                      Click any AI tool above to generate and view results.
                    </p>
                  </div>
                </div>
              )}

              {/* Transcript */}

              {activeTab === "transcript" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                     Transcript
                  </h2>

                  {loadingTranscript ? (
                    <p>Generating transcript...</p>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-5 max-h-[500px] overflow-y-auto whitespace-pre-wrap">
                      {transcript}
                    </div>
                  )}
                </div>
              )}

              {/* Summary */}

              {activeTab === "summary" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                     AI Summary
                  </h2>

                  {loadingSummary ? (
                    <p>Generating summary...</p>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-5 whitespace-pre-wrap">
                      {summary}
                    </div>
                  )}
                </div>
              )}

              {/* Key Moments */}

              {activeTab === "keymoments" && (
                <div>

                  <h2 className="text-2xl font-bold mb-4">
                     Key Moments
                  </h2>

                  {loadingKeyMoments ? (
                    <p>Generating key moments...</p>
                  ) : (
                    <div className="space-y-4">

                      {keyMoments.length === 0 ? (

                        <p className="text-gray-500">
                          No key moments found.
                        </p>

                      ) : (

                        keyMoments.map((moment, index) => (

                          <div
                            key={index}
                            className="border rounded-lg p-4 bg-gray-50"
                          >

                            <p className="font-semibold">
                              {moment.text}
                            </p>

                            <p className="text-sm text-gray-500 mt-2">
                              {Number(moment.start).toFixed(2)}s - {Number(moment.end).toFixed(2)}s
                            </p>

                            <p className="text-xs text-blue-600 mt-1">
                              Score : {Number(moment.score).toFixed(2)}
                            </p>

                          </div>

                        ))

                      )}

                    </div>
                  )}

                </div>
              )}

              {/* Highlights */}

              {activeTab === "highlights" && (
                <div>

                  <h2 className="text-2xl font-bold mb-4">
                     Highlight Report
                  </h2>

                  {loadingHighlights ? (
                    <p>Generating highlights...</p>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-5 whitespace-pre-wrap">
                      {highlights}
                    </div>
                  )}

                </div>
              )}

              {/* Keywords */}

              {activeTab === "keywords" && (
                <div>

                  <h2 className="text-2xl font-bold mb-4">
                     Keywords
                  </h2>

                  {loadingKeywords ? (
                    <p>Generating keywords...</p>
                  ) : (

                    <div className="flex flex-wrap gap-3">

                      {keywords.length === 0 ? (

                        <p className="text-gray-500">
                          No keywords found.
                        </p>

                      ) : (

                        keywords.map((item, index) => (

                          <span
                            key={index}
                            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full"
                          >
                            {typeof item === "string"
                              ? item
                              : item.keyword}
                          </span>

                        ))

                      )}

                    </div>

                  )}

                </div>
              )}

            </div>

          </div>

        )}

      </div>

    </DashboardLayout>

  );
};

export default UploadVideo;
