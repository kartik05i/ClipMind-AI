import { useEffect, useState } from "react";

import {
  Cpu,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Eye,
  Loader2,
} from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";

import api from "../services/api";


const AIProcessingJobs = () => {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchJobs = async () => {

    try {

      setLoading(true);

      /*
        IMPORTANT:

        This does NOT contain any fake/sample videos.

        Replace "/admin/processing-jobs" with your exact backend
        endpoint if your backend uses a different route.
      */

      const response = await api.get("/admin/processing-jobs");

      setJobs(response.data);

    } catch (error) {

      console.error(
        "Failed to fetch processing jobs:",
        error
      );

      // Do NOT show fake data if API fails
      setJobs([]);

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchJobs();

  }, []);



  const getStatusBadge = (status) => {

    const normalizedStatus =
      status?.toLowerCase() || "pending";


    if (normalizedStatus === "completed") {

      return (

        <span className="flex items-center gap-2 w-fit bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium">

          <CheckCircle2 size={17} />

          Completed

        </span>

      );

    }


    if (normalizedStatus === "processing") {

      return (

        <span className="flex items-center gap-2 w-fit bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium">

          <Loader2
            size={17}
            className="animate-spin"
          />

          Processing

        </span>

      );

    }


    if (normalizedStatus === "failed") {

      return (

        <span className="flex items-center gap-2 w-fit bg-red-100 text-red-700 px-4 py-2 rounded-full font-medium">

          <XCircle size={17} />

          Failed

        </span>

      );

    }


    return (

      <span className="flex items-center gap-2 w-fit bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-medium">

        <Clock size={17} />

        Pending

      </span>

    );

  };



  const totalJobs = jobs.length;


  const completedJobs = jobs.filter(
    (job) =>
      job.status?.toLowerCase() === "completed"
  ).length;


  const processingJobs = jobs.filter(
    (job) =>
      job.status?.toLowerCase() === "processing"
  ).length;


  const failedJobs = jobs.filter(
    (job) =>
      job.status?.toLowerCase() === "failed"
  ).length;



  return (

    <div className="min-h-screen bg-gray-50">


      <DashboardNavbar />


      <div className="flex">


        <Sidebar />


        <main className="flex-1 min-w-0 p-8">


          {/* PAGE HEADER */}

          <div className="flex items-start justify-between mb-8">


            <div>

              <h1 className="text-4xl font-bold text-gray-800">

                AI Processing Jobs

              </h1>


              <p className="text-gray-500 mt-2 text-lg">

                Monitor AI processing activities for uploaded videos.

              </p>

            </div>


            <button
              onClick={fetchJobs}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
            >

              <RefreshCw size={20} />

              Refresh

            </button>


          </div>



          {/* STATISTICS */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">


            <div className="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 text-lg">

                    Total Jobs

                  </p>


                  <h2 className="text-4xl font-bold text-gray-900 mt-3">

                    {totalJobs}

                  </h2>

                </div>


                <Cpu
                  size={38}
                  className="text-blue-600"
                />

              </div>

            </div>



            <div className="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 text-lg">

                    Completed

                  </p>


                  <h2 className="text-4xl font-bold text-green-600 mt-3">

                    {completedJobs}

                  </h2>

                </div>


                <CheckCircle2
                  size={38}
                  className="text-green-600"
                />

              </div>

            </div>



            <div className="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 text-lg">

                    Processing

                  </p>


                  <h2 className="text-4xl font-bold text-blue-600 mt-3">

                    {processingJobs}

                  </h2>

                </div>


                <Loader2
                  size={38}
                  className="text-blue-600 animate-spin"
                />

              </div>

            </div>



            <div className="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 text-lg">

                    Failed

                  </p>


                  <h2 className="text-4xl font-bold text-red-600 mt-3">

                    {failedJobs}

                  </h2>

                </div>


                <XCircle
                  size={38}
                  className="text-red-600"
                />

              </div>

            </div>


          </div>



          {/* JOBS TABLE */}

          <div className="bg-white border border-gray-300 rounded-2xl shadow-sm overflow-hidden">


            <div className="flex items-center gap-3 p-6 border-b border-gray-300">

              <Cpu
                size={26}
                className="text-blue-600"
              />


              <div>

                <h2 className="text-2xl font-semibold text-gray-800">

                  Processing Jobs

                </h2>


                <p className="text-gray-500 mt-1">

                  Real processing jobs from the platform.

                </p>

              </div>

            </div>



            <div className="overflow-x-auto">


              {loading ? (

                <div className="flex justify-center items-center py-16">

                  <Loader2
                    size={35}
                    className="animate-spin text-blue-600"
                  />

                </div>

              ) : jobs.length === 0 ? (

                <div className="text-center py-16">

                  <Cpu
                    size={50}
                    className="mx-auto text-gray-400 mb-4"
                  />


                  <h3 className="text-xl font-semibold text-gray-700">

                    No Processing Jobs Found

                  </h3>


                  <p className="text-gray-500 mt-2">

                    Processing jobs will appear here when real videos are processed.

                  </p>

                </div>

              ) : (

                <table className="w-full">


                  <thead className="border-b border-gray-300 bg-gray-50">

                    <tr className="text-left text-gray-800">

                      <th className="px-6 py-5">

                        Job ID

                      </th>


                      <th className="px-6 py-5">

                        Video

                      </th>


                      <th className="px-6 py-5">

                        Processing Type

                      </th>


                      <th className="px-6 py-5">

                        Status

                      </th>


                      <th className="px-6 py-5">

                        Started At

                      </th>


                      <th className="px-6 py-5">

                        Actions

                      </th>

                    </tr>

                  </thead>



                  <tbody>


                    {jobs.map((job) => (

                      <tr
                        key={job.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition"
                      >


                        <td className="px-6 py-5 font-semibold">

                          #{job.id}

                        </td>


                        <td className="px-6 py-5 font-medium text-gray-800">

                          {job.video_name || job.video || "Unknown Video"}

                        </td>


                        <td className="px-6 py-5 text-gray-600">

                          {job.processing_type || job.type || "-"}

                        </td>


                        <td className="px-6 py-5">

                          {getStatusBadge(job.status)}

                        </td>


                        <td className="px-6 py-5 text-gray-500">

                          {job.started_at || job.created_at || "-"}

                        </td>


                        <td className="px-6 py-5">

                          <button
                            onClick={() =>
                              console.log("Job:", job)
                            }
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                          >

                            <Eye size={18} />

                            View

                          </button>

                        </td>


                      </tr>

                    ))}


                  </tbody>


                </table>

              )}


            </div>


          </div>


        </main>


      </div>


    </div>

  );

};


export default AIProcessingJobs;