import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import { getAllVideos } from "../services/videoService";
import { getTranscript } from "../services/transcriptService";
import { getSummary } from "../services/summaryService";
import { getKeyMoments } from "../services/keyMomentService";
import { getHighlights } from "../services/highlightService";
import { getKeywords } from "../services/keywordService";

const ContentInsights = () => {

    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState("");
    const [selectedSection, setSelectedSection] = useState("");

    const [transcript, setTranscript] = useState("");
    const [summary, setSummary] = useState("");
    const [keyMoments, setKeyMoments] = useState([]);
    const [highlights, setHighlights] = useState("");
    const [keywords, setKeywords] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadVideos();
    }, []);

    const loadVideos = async () => {

        try {

            const data = await getAllVideos();

            const videoList = Array.isArray(data)
                ? data
                : data.videos || [];

            setVideos(videoList);

            if (videoList.length > 0) {
                setSelectedVideo(videoList[0].video_id);
            }

        } catch (err) {
            console.error(err);
        }

    };

    const loadSection = async (section) => {

        if (!selectedVideo) return;

        setSelectedSection(section);
        setLoading(true);

        try {

            switch (section) {

                case "transcript": {

                    const data = await getTranscript(selectedVideo);
                    setTranscript(data.transcript);
                    break;
                }

                case "summary": {

                    const data = await getSummary(selectedVideo);
                    setSummary(data.summary);
                    break;
                }

                case "keymoments": {

                    const data = await getKeyMoments(selectedVideo);
                    setKeyMoments(data.key_moments);
                    break;
                }

                case "highlights": {

                    const data = await getHighlights(selectedVideo);
                    setHighlights(data.highlight_report);
                    break;
                }

                case "keywords": {

                    const data = await getKeywords(selectedVideo);
                    setKeywords(data.keywords);
                    break;
                }

                default:
                    break;

            }

        } catch (err) {

            console.error(err);

        }

        setLoading(false);

    };

    return (

        <DashboardLayout>

            <div className="max-w-7xl mx-auto">

                <h1 className="text-4xl font-bold">
                    Content Insights
                </h1>

                <p className="text-gray-500 mt-2 mb-8">
                    Analyze AI generated insights for uploaded videos.
                </p>

                <div className="bg-white border rounded-xl shadow-sm p-6 mb-8">

                    <label className="block font-semibold mb-3">
                        Select Video
                    </label>

                    <select
                        value={selectedVideo}
                        onChange={(e) => setSelectedVideo(e.target.value)}
                        className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    >

                        {videos.map((video) => (

                            <option
                                key={video.video_id}
                                value={video.video_id}
                            >
                                {video.filename}
                            </option>

                        ))}

                    </select>

                </div>

                <div className="grid grid-cols-5 gap-4 mb-8">

                    {[
                        "Transcript",
                        "Summary",
                        "Key Moments",
                        "Highlights",
                        "Keywords",
                    ].map((item) => {

                        const value = item
                            .toLowerCase()
                            .replace(" ", "");

                        return (

                            <button
                                key={item}
                                onClick={() => loadSection(value)}
                                className={`h-16 rounded-xl font-semibold transition-all duration-200 flex justify-center items-center border ${
                                    selectedSection === value
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                                }`}
                            >

                                {item}

                            </button>

                        );

                    })}

                </div>

                <div className="bg-white border rounded-xl shadow-sm p-8 min-h-[450px]">
                                        {loading ? (

                        <div className="flex justify-center items-center h-[350px]">

                            <p className="text-lg font-semibold">
                                Loading...
                            </p>

                        </div>

                    ) : selectedSection === "" ? (

                        <div className="flex justify-center items-center h-[350px]">

                            <div className="text-center">

                                <h2 className="text-2xl font-semibold text-gray-700">
                                    No AI Tool Selected
                                </h2>

                                <p className="text-gray-500 mt-3">
                                    Select Transcript, Summary, Key Moments,
                                    Highlights or Keywords to view the result.
                                </p>

                            </div>

                        </div>

                    ) : selectedSection === "transcript" ? (

                        <>

                            <h2 className="text-3xl font-bold mb-6">
                                Transcript
                            </h2>

                            <div className="bg-gray-50 border rounded-lg p-6 whitespace-pre-wrap">

                                {transcript}

                            </div>

                        </>

                    ) : selectedSection === "summary" ? (

                        <>

                            <h2 className="text-3xl font-bold mb-6">
                                Summary
                            </h2>

                            <div className="bg-gray-50 border rounded-lg p-6 whitespace-pre-wrap">

                                {summary}

                            </div>

                        </>

                    ) : selectedSection === "keymoments" ? (
                                            <>

                        <h2 className="text-3xl font-bold mb-6">
                            Key Moments
                        </h2>

                        <div className="space-y-4">

                            {keyMoments.length > 0 ? (

                                keyMoments.map((moment, index) => (

                                    <div
                                        key={index}
                                        className="border rounded-lg p-5 bg-gray-50"
                                    >

                                        <div className="flex justify-between items-center">

                                            <span className="font-semibold">
                                                {moment.start}s - {moment.end}s
                                            </span>

                                            <span className="text-blue-600 text-sm">
                                                Score : {moment.score}
                                            </span>

                                        </div>

                                        <p className="mt-3 whitespace-pre-wrap">
                                            {moment.text}
                                        </p>

                                    </div>

                                ))

                            ) : (

                                <div className="text-center py-10 text-gray-500">

                                    No key moments found.

                                </div>

                            )}

                        </div>

                    </>

                ) : selectedSection === "highlights" ? (
                                        <>

                        <h2 className="text-3xl font-bold mb-6">
                            Highlights
                        </h2>

                        <div className="bg-gray-50 border rounded-lg p-6 whitespace-pre-wrap min-h-[220px]">

                            {highlights ? (

                                highlights

                            ) : (

                                <div className="text-center py-10 text-gray-500">

                                    No highlights found.

                                </div>

                            )}

                        </div>

                    </>

                ) : selectedSection === "keywords" ? (

                    <>

                        <h2 className="text-3xl font-bold mb-6">
                            Keywords
                        </h2>

                        <div className="flex flex-wrap gap-3">

                            {keywords.length > 0 ? (

                                keywords.map((word, index) => (

                                    <span
                                        key={index}
                                        className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium"
                                    >
                                        {word}
                                    </span>

                                ))

                            ) : (

                                <div className="text-gray-500">

                                    No keywords found.

                                </div>

                            )}

                        </div>

                    </>

                ) : (
                                        <div className="flex justify-center items-center h-[300px]">

                        <p className="text-gray-500">
                            Select an AI tool to view the results.
                        </p>

                    </div>

                )}

                </div>

            </div>

        </DashboardLayout>

    );

};

export default ContentInsights;