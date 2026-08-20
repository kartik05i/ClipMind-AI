import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import {
    Bookmark,
    Search,
    Download,
    Pencil,
    Share2,
    Save,
    X,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";

import { getAllVideos } from "../services/videoService";
import { getTranscript } from "../services/transcriptService";
import { getSummary } from "../services/summaryService";
import { getKeyMoments } from "../services/keyMomentService";
import { getHighlights } from "../services/highlightService";
import { getKeywords } from "../services/keywordService";

import { saveLearningHistory } from "../services/learningHistoryService";
import { saveBookmark } from "../services/bookmarkService";


const ContentInsights = () => {

    const location = useLocation();


    // ================= GET LOGGED-IN USER =================

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const role = user.role;


    // ================= STATES =================

    const [videos, setVideos] = useState([]);

    const [selectedVideo, setSelectedVideo] =
        useState("");

    const [selectedSection, setSelectedSection] =
        useState("");

    const [transcript, setTranscript] =
        useState("");

    const [summary, setSummary] =
        useState("");

    const [keyMoments, setKeyMoments] =
        useState([]);

    const [highlights, setHighlights] =
        useState("");

    const [keywords, setKeywords] =
        useState([]);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    // ================= EDUCATOR STATES =================

    const [isEditingTranscript,
        setIsEditingTranscript] =
        useState(false);

    const [editedTranscript,
        setEditedTranscript] =
        useState("");

    const [transcriptSaved,
        setTranscriptSaved] =
        useState(false);


    // ================= LOAD VIDEOS =================

    useEffect(() => {
        loadVideos();
    }, []);


    const loadVideos = async () => {

        try {

            const data =
                await getAllVideos();

            const videoList =
                Array.isArray(data)
                    ? data
                    : data.videos || [];

            setVideos(videoList);


            const passedVideoId =
                location.state?.videoId;


            if (passedVideoId) {

                const selectedVideoExists =
                    videoList.some(
                        (video) =>
                            String(
                                video.video_id
                            ) ===
                            String(
                                passedVideoId
                            )
                    );


                if (selectedVideoExists) {

                    setSelectedVideo(
                        String(
                            passedVideoId
                        )
                    );

                    return;
                }

            }


            if (videoList.length > 0) {

                setSelectedVideo(
                    String(
                        videoList[0].video_id
                    )
                );

            }

        } catch (err) {

            console.error(err);

        }

    };


    // ================= LOAD SECTION =================

    const loadSection = async (section) => {

        if (!selectedVideo) return;


        setSelectedSection(section);

        setLoading(true);


        // Reset learner search

        if (section !== "transcript") {

            setSearchTerm("");

        }


        // Reset educator edit mode

        setIsEditingTranscript(false);

        setTranscriptSaved(false);


        try {

            switch (section) {


                // ================= TRANSCRIPT =================

                case "transcript": {

                    const data =
                        await getTranscript(
                            selectedVideo
                        );


                    const transcriptData =
                        data.transcript || "";


                    setTranscript(
                        transcriptData
                    );


                    setEditedTranscript(
                        transcriptData
                    );


                    // Learner only

                    if (role === "Learner") {

                        await saveLearningHistory(
                            selectedVideo,
                            "Viewed Transcript"
                        );

                    }


                    break;

                }


                // ================= SUMMARY =================

                case "summary": {

                    const data =
                        await getSummary(
                            selectedVideo
                        );


                    setSummary(
                        data.summary || ""
                    );


                    // Learner only

                    if (role === "Learner") {

                        await saveLearningHistory(
                            selectedVideo,
                            "Viewed Summary"
                        );

                    }


                    break;

                }


                // ================= KEY MOMENTS =================

                case "keymoments": {

                    const data =
                        await getKeyMoments(
                            selectedVideo
                        );


                    setKeyMoments(
                        data.key_moments || []
                    );


                    // Learner only

                    if (role === "Learner") {

                        await saveLearningHistory(
                            selectedVideo,
                            "Viewed Key Moments"
                        );

                    }


                    break;

                }


                // ================= HIGHLIGHTS =================

                case "highlights": {

                    const data =
                        await getHighlights(
                            selectedVideo
                        );


                    setHighlights(
                        data.highlight_report || ""
                    );


                    // Learner only

                    if (role === "Learner") {

                        await saveLearningHistory(
                            selectedVideo,
                            "Viewed Highlights"
                        );

                    }


                    break;

                }


                // ================= KEYWORDS =================

                case "keywords": {

                    const data =
                        await getKeywords(
                            selectedVideo
                        );


                    setKeywords(
                        data.keywords || []
                    );


                    // Learner only

                    if (role === "Learner") {

                        await saveLearningHistory(
                            selectedVideo,
                            "Viewed Keywords"
                        );

                    }


                    break;

                }


                default:

                    break;

            }

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };


    // ================= BOOKMARK =================

    const handleBookmark = async (
        contentType,
        content
    ) => {

        if (!selectedVideo) {

            alert(
                "Please select a video first."
            );

            return;

        }


        if (!content) {

            alert(
                "No content available to bookmark."
            );

            return;

        }


        try {

            const response =
                await saveBookmark(
                    selectedVideo,
                    contentType,
                    content
                );


            alert(
                response.message
            );

        } catch (error) {

            console.error(
                "Bookmark failed:",
                error
            );


            alert(
                error.response?.data?.detail ||
                "Failed to save bookmark"
            );

        }

    };


    // ================= DOWNLOAD CONTENT =================

    const downloadFile = (
        content,
        fileName
    ) => {

        if (!content) {

            alert(
                "No content available to download."
            );

            return;

        }


        const blob = new Blob(
            [content],
            {
                type: "text/plain"
            }
        );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download = fileName;


        document.body.appendChild(link);


        link.click();


        document.body.removeChild(link);


        URL.revokeObjectURL(url);

    };


    // ================= EDUCATOR EDIT TRANSCRIPT =================

    const handleEditTranscript = () => {

        setEditedTranscript(
            transcript
        );

        setIsEditingTranscript(
            true
        );

        setTranscriptSaved(
            false
        );

    };


    const handleSaveTranscript = () => {

        // Currently saves the edited version locally.
        // Backend API can be connected later.

        setTranscript(
            editedTranscript
        );

        setIsEditingTranscript(
            false
        );

        setTranscriptSaved(
            true
        );

    };


    const handleCancelEdit = () => {

        setEditedTranscript(
            transcript
        );

        setIsEditingTranscript(
            false
        );

    };


    // ================= EDUCATOR SHARE SUMMARY =================

    const handleShareSummary = async () => {

        if (!summary) {

            alert(
                "No summary available to share."
            );

            return;

        }


        try {

            if (
                navigator.share
            ) {

                await navigator.share({

                    title:
                        "Video Summary",

                    text:
                        summary,

                });

            } else {

                await navigator.clipboard.writeText(
                    summary
                );


                alert(
                    "Summary copied to clipboard successfully."
                );

            }

        } catch (error) {

            console.error(
                "Sharing failed:",
                error
            );

        }

    };


    // ================= TRANSCRIPT SEARCH =================

    const renderTranscript = () => {

        if (!searchTerm.trim()) {

            return transcript;

        }


        const regex =
            new RegExp(

                `(${searchTerm.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                )})`,

                "gi"

            );


        const parts =
            transcript.split(
                regex
            );


        return parts.map(
            (part, index) =>
                regex.test(part)
                    ? (

                        <mark
                            key={index}
                            className="bg-yellow-300 px-1 rounded"
                        >
                            {part}
                        </mark>

                    )
                    : (

                        <span
                            key={index}
                        >
                            {part}
                        </span>

                    )
        );

    };


    // ================= SEARCH MATCHES =================

    const searchMatches =
        searchTerm.trim()
            ? transcript.match(

                new RegExp(

                    searchTerm.replace(
                        /[.*+?^${}()|[\]\\]/g,
                        "\\$&"
                    ),

                    "gi"

                )

            ) || []

            : [];


    const matchCount =
        searchMatches.length;


    const hasSearchResults =
        searchTerm.trim() === "" ||
        matchCount > 0;


    return (

        <DashboardLayout>

            <div className="max-w-7xl mx-auto">


                {/* ================= PAGE HEADING ================= */}

                <h1 className="text-4xl font-bold">

                    Content Insights

                </h1>


                <p className="text-gray-500 mt-2 mb-8">

                    Analyze AI generated insights
                    for uploaded videos.

                </p>


                {/* ================= VIDEO SELECTOR ================= */}

                <div className="bg-white border rounded-xl shadow-sm p-6 mb-8">

                    <label className="block font-semibold mb-3">

                        Select Video

                    </label>


                    <select

                        value={selectedVideo}

                        onChange={(e) => {

                            setSelectedVideo(
                                e.target.value
                            );


                            setSelectedSection("");

                            setSearchTerm("");

                            setIsEditingTranscript(
                                false
                            );

                        }}

                        className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    >

                        {videos.length > 0 ? (

                            videos.map(
                                (video) => (

                                    <option
                                        key={
                                            video.video_id
                                        }

                                        value={
                                            String(
                                                video.video_id
                                            )
                                        }
                                    >

                                        {video.title}

                                    </option>

                                )
                            )

                        ) : (

                            <option value="">

                                No videos available

                            </option>

                        )}

                    </select>

                </div>


                {/* ================= AI TOOL BUTTONS ================= */}

                <div className="grid grid-cols-5 gap-4 mb-8">


                    {/* TRANSCRIPT */}

                    <button

                        onClick={() =>
                            loadSection(
                                "transcript"
                            )
                        }

                        className={`border rounded-xl p-4 font-semibold transition ${
                            selectedSection ===
                            "transcript"

                                ? "bg-blue-600 text-white border-blue-600"

                                : "bg-white hover:bg-blue-50 hover:border-blue-500"
                        }`}
                    >

                        Transcript

                    </button>


                    {/* SUMMARY */}

                    <button

                        onClick={() =>
                            loadSection(
                                "summary"
                            )
                        }

                        className={`border rounded-xl p-4 font-semibold transition ${
                            selectedSection ===
                            "summary"

                                ? "bg-blue-600 text-white border-blue-600"

                                : "bg-white hover:bg-blue-50 hover:border-blue-500"
                        }`}
                    >

                        Summary

                    </button>


                    {/* KEY MOMENTS */}

                    <button

                        onClick={() =>
                            loadSection(
                                "keymoments"
                            )
                        }

                        className={`border rounded-xl p-4 font-semibold transition ${
                            selectedSection ===
                            "keymoments"

                                ? "bg-blue-600 text-white border-blue-600"

                                : "bg-white hover:bg-blue-50 hover:border-blue-500"
                        }`}
                    >

                        Key Moments

                    </button>


                    {/* HIGHLIGHTS */}

                    <button

                        onClick={() =>
                            loadSection(
                                "highlights"
                            )
                        }

                        className={`border rounded-xl p-4 font-semibold transition ${
                            selectedSection ===
                            "highlights"

                                ? "bg-blue-600 text-white border-blue-600"

                                : "bg-white hover:bg-blue-50 hover:border-blue-500"
                        }`}
                    >

                        Highlights

                    </button>


                    {/* KEYWORDS */}

                    <button

                        onClick={() =>
                            loadSection(
                                "keywords"
                            )
                        }

                        className={`border rounded-xl p-4 font-semibold transition ${
                            selectedSection ===
                            "keywords"

                                ? "bg-blue-600 text-white border-blue-600"

                                : "bg-white hover:bg-blue-50 hover:border-blue-500"
                        }`}
                    >

                        Keywords

                    </button>

                </div>


                {/* ================= CONTENT AREA ================= */}

                <div className="bg-white border rounded-xl shadow-sm p-8">


                    {/* ================= LOADING ================= */}

                    {loading ? (

                        <div className="flex justify-center items-center h-[300px]">

                            <p className="text-gray-500 text-lg">

                                Loading content...

                            </p>

                        </div>


                    ) : selectedSection ===
                    "transcript" ? (

                        <>


                            <h2 className="text-3xl font-bold mb-6">

                                Transcript

                            </h2>


                            {/* ================= LEARNER SEARCH ================= */}

                            {role === "Learner" && (

                                <>

                                    <div className="relative mb-5">

                                        <Search

                                            size={20}

                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        />


                                        <input

                                            type="text"

                                            value={
                                                searchTerm
                                            }

                                            onChange={(e) =>
                                                setSearchTerm(
                                                    e.target.value
                                                )
                                            }

                                            placeholder="Search in transcript..."

                                            className="w-full border rounded-lg py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                                        />

                                    </div>


                                    {searchTerm.trim() && (

                                        <div
                                            className={`mb-4 text-sm ${
                                                hasSearchResults
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                            }`}
                                        >

                                            {hasSearchResults

                                                ? `${matchCount} ${
                                                    matchCount === 1
                                                        ? "match"
                                                        : "matches"
                                                } found`

                                                : "No matching text found."

                                            }

                                        </div>

                                    )}

                                </>

                            )}


                            {/* ================= EDUCATOR EDIT MODE ================= */}

                            {role === "Educator" &&
                            isEditingTranscript ? (

                                <textarea

                                    value={
                                        editedTranscript
                                    }

                                    onChange={(e) =>
                                        setEditedTranscript(
                                            e.target.value
                                        )
                                    }

                                    className="w-full min-h-[350px] bg-gray-50 border rounded-lg p-6 outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                                />

                            ) : (

                                <div className="bg-gray-50 border rounded-lg p-6 whitespace-pre-wrap leading-relaxed">

                                    {role === "Learner"

                                        ? renderTranscript()

                                        : transcript

                                    }

                                </div>

                            )}


                            {/* ================= EDUCATOR ACTIONS ================= */}

                            {role === "Educator" && (

                                <div className="mt-6 flex gap-3 flex-wrap">


                                    {isEditingTranscript ? (

                                        <>

                                            <button

                                                onClick={
                                                    handleSaveTranscript
                                                }

                                                className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                            >

                                                <Save size={18} />

                                                Save Transcript

                                            </button>


                                            <button

                                                onClick={
                                                    handleCancelEdit
                                                }

                                                className="flex items-center gap-2 px-5 py-3 border rounded-lg hover:bg-gray-100 transition"
                                            >

                                                <X size={18} />

                                                Cancel

                                            </button>

                                        </>

                                    ) : (

                                        <button

                                            onClick={
                                                handleEditTranscript
                                            }

                                            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >

                                            <Pencil size={18} />

                                            Review / Edit Transcript

                                        </button>

                                    )}


                                    {transcriptSaved && (

                                        <span className="flex items-center text-green-600 font-medium">

                                            Transcript updated successfully

                                        </span>

                                    )}

                                </div>

                            )}


                            {/* ================= CONTENT CREATOR DOWNLOAD ================= */}

                            {role ===
                            "Content Creator" && (

                                <button

                                    onClick={() =>
                                        downloadFile(
                                            transcript,
                                            "transcript.txt"
                                        )
                                    }

                                    className="mt-6 flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >

                                    <Download size={18} />

                                    Download Transcript

                                </button>

                            )}

                        </>


                    ) : selectedSection ===
                    "summary" ? (

                        <>

                            <div className="flex justify-between items-center mb-6">

                                <h2 className="text-3xl font-bold">

                                    Summary

                                </h2>


                                {/* LEARNER BOOKMARK */}

                                {role === "Learner" && (

                                    <button

                                        onClick={() =>
                                            handleBookmark(
                                                "summary",
                                                summary
                                            )
                                        }

                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >

                                        <Bookmark size={18} />

                                        Bookmark Summary

                                    </button>

                                )}

                            </div>


                            <div className="bg-gray-50 border rounded-lg p-6 whitespace-pre-wrap">

                                {summary}

                            </div>


                            {/* ================= EDUCATOR SHARE ================= */}

                            {role === "Educator" && (

                                <button

                                    onClick={
                                        handleShareSummary
                                    }

                                    className="mt-6 flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >

                                    <Share2 size={18} />

                                    Share Summary

                                </button>

                            )}


                            {/* ================= CONTENT CREATOR DOWNLOAD ================= */}

                            {role ===
                            "Content Creator" && (

                                <button

                                    onClick={() =>
                                        downloadFile(
                                            summary,
                                            "summary.txt"
                                        )
                                    }

                                    className="mt-6 flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >

                                    <Download size={18} />

                                    Download Summary

                                </button>

                            )}

                        </>


                    ) : selectedSection ===
                    "keymoments" ? (

                        <>

                            <h2 className="text-3xl font-bold mb-6">

                                Key Moments

                            </h2>


                            <div className="space-y-4">

                                {keyMoments.length > 0 ? (

                                    keyMoments.map(
                                        (
                                            moment,
                                            index
                                        ) => (

                                            <div

                                                key={index}

                                                className="border rounded-lg p-5 bg-gray-50"
                                            >

                                                <div className="flex justify-between items-center">

                                                    <span className="font-semibold">

                                                        {moment.start}s -{" "}

                                                        {moment.end}s

                                                    </span>


                                                    <span className="text-blue-600 text-sm">

                                                        Score :{" "}

                                                        {moment.score}

                                                    </span>

                                                </div>


                                                <p className="mt-3 whitespace-pre-wrap">

                                                    {moment.text}

                                                </p>

                                            </div>

                                        )
                                    )

                                ) : (

                                    <div className="text-center py-10 text-gray-500">

                                        No key moments found.

                                    </div>

                                )}

                            </div>

                        </>


                    ) : selectedSection ===
                    "highlights" ? (

                        <>

                            <div className="flex justify-between items-center mb-6">

                                <h2 className="text-3xl font-bold">

                                    Highlights

                                </h2>


                                {/* LEARNER BOOKMARK */}

                                {role === "Learner" && (

                                    <button

                                        onClick={() =>
                                            handleBookmark(
                                                "highlight",
                                                highlights
                                            )
                                        }

                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >

                                        <Bookmark size={18} />

                                        Bookmark Highlights

                                    </button>

                                )}

                            </div>


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


                    ) : selectedSection ===
                    "keywords" ? (

                        <>

                            <h2 className="text-3xl font-bold mb-6">

                                Keywords

                            </h2>


                            <div className="flex flex-wrap gap-3">

                                {keywords.length > 0 ? (

                                    keywords.map(
                                        (
                                            word,
                                            index
                                        ) => (

                                            <span

                                                key={index}

                                                className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium"
                                            >

                                                {word}

                                            </span>

                                        )
                                    )

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