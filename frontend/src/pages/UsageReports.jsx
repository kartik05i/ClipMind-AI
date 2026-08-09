import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import { getUsageReport } from "../services/dashboardService";

const UsageReports = () => {

    const [report, setReport] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadReport();

    }, []);

    const loadReport = async () => {

        try {

            const data = await getUsageReport();

            setReport(data);

        } catch (err) {

            console.error(err);

        }

        setLoading(false);

    };

    if (loading) {

        return (

            <DashboardLayout>

                <div className="flex justify-center items-center h-[500px]">

                    <p className="text-lg font-semibold">
                        Loading Usage Report...
                    </p>

                </div>

            </DashboardLayout>

        );

    }

    return (

        <DashboardLayout>

            <div className="max-w-7xl mx-auto">

                <h1 className="text-4xl font-bold">

                    Usage Reports

                </h1>

                <p className="text-gray-500 mt-2 mb-8">

                    View and analyze AI usage statistics for uploaded videos.

                </p>
                                <div className="grid grid-cols-4 gap-6 mb-10">

                    <div className="bg-white rounded-xl border shadow-sm p-6">

                        <p className="text-gray-500 text-sm">
                            Total Videos
                        </p>

                        <h2 className="text-4xl font-bold mt-3">
                            {report.total_videos}
                        </h2>

                    </div>

                    <div className="bg-white rounded-xl border shadow-sm p-6">

                        <p className="text-gray-500 text-sm">
                            Storage Used
                        </p>

                        <h2 className="text-4xl font-bold mt-3">
                            {report.storage_used_mb} MB
                        </h2>

                    </div>

                    <div className="bg-white rounded-xl border shadow-sm p-6">

                        <p className="text-gray-500 text-sm">
                            AI Reports
                        </p>

                        <h2 className="text-4xl font-bold mt-3">
                            {report.ai_reports}
                        </h2>

                    </div>

                    <div className="bg-white rounded-xl border shadow-sm p-6">

                        <p className="text-gray-500 text-sm">
                            Keywords
                        </p>

                        <h2 className="text-4xl font-bold mt-3">
                            {report.keywords}
                        </h2>

                    </div>

                </div>
                                <div className="bg-white rounded-xl border shadow-sm p-6 mb-10">

                    <h2 className="text-2xl font-bold mb-6">
                        AI Usage Statistics
                    </h2>

                    <div className="grid grid-cols-5 gap-6">

                        <div className="text-center">

                            <p className="text-gray-500">
                                Transcript
                            </p>

                            <h3 className="text-3xl font-bold mt-3">
                                {report.transcripts}
                            </h3>

                        </div>

                        <div className="text-center">

                            <p className="text-gray-500">
                                Summary
                            </p>

                            <h3 className="text-3xl font-bold mt-3">
                                {report.summaries}
                            </h3>

                        </div>

                        <div className="text-center">

                            <p className="text-gray-500">
                                Key Moments
                            </p>

                            <h3 className="text-3xl font-bold mt-3">
                                {report.key_moments}
                            </h3>

                        </div>

                        <div className="text-center">

                            <p className="text-gray-500">
                                Highlights
                            </p>

                            <h3 className="text-3xl font-bold mt-3">
                                {report.highlights}
                            </h3>

                        </div>

                        <div className="text-center">

                            <p className="text-gray-500">
                                Keywords
                            </p>

                            <h3 className="text-3xl font-bold mt-3">
                                {report.keywords}
                            </h3>

                        </div>

                    </div>

                </div>
                                <div className="bg-white rounded-xl border shadow-sm p-6 mb-10">

                    <h2 className="text-2xl font-bold mb-6">
                        Recent Activity
                    </h2>

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr className="border-b">

                                    <th className="text-left py-3">
                                        Video
                                    </th>

                                    <th className="text-left py-3">
                                        Status
                                    </th>

                                    <th className="text-left py-3">
                                        Uploaded On
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {report.recent_activity.map((video, index) => (

                                    <tr
                                        key={index}
                                        className="border-b hover:bg-gray-50"
                                    >

                                        <td className="py-4">
                                            {video.title}
                                        </td>

                                        <td className="py-4">

                                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">

                                                {video.status}

                                            </span>

                                        </td>

                                        <td className="py-4">

                                            {new Date(
                                                video.uploaded_at
                                            ).toLocaleDateString()}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>
                            </div>

        </DashboardLayout>

    );

};

export default UsageReports;