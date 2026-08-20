import { useEffect, useState } from "react";

import {
  Settings,
  Upload,
  Brain,
  Save,
  RefreshCw,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";

import {
  getPlatformSettings,
  updatePlatformSettings,
} from "../services/platformSettingsService";


const defaultSettings = {
  platformName: "ClipMind AI",
  platformDescription:
    "AI-powered video summarization and learning platform.",
  maintenanceMode: false,

  maxUploadSize: "500",
  allowedFormats: "MP4, MOV, AVI",
  defaultVisibility: "Private",

  defaultLanguage: "English",
  autoProcessing: true,
};


const PlatformSettings = () => {

  const [settings, setSettings] = useState(defaultSettings);

  const [originalSettings, setOriginalSettings] =
    useState(defaultSettings);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);


  // ================= LOAD SETTINGS =================

  useEffect(() => {
    loadSettings();
  }, []);


  const loadSettings = async () => {

    try {

      setLoading(true);

      const data = await getPlatformSettings();


      const formattedSettings = {
        platformName:
          data.platform_name || "ClipMind AI",

        platformDescription:
          data.platform_description || "",

        maintenanceMode:
          data.maintenance_mode || false,

        maxUploadSize:
          String(data.max_upload_size || 500),

        allowedFormats:
          data.allowed_formats || "",

        defaultVisibility:
          data.default_visibility || "Private",

        defaultLanguage:
          data.default_language || "English",

        autoProcessing:
          data.auto_processing ?? true,
      };


      setSettings(formattedSettings);

      setOriginalSettings(formattedSettings);


    } catch (error) {

      console.error(
        "Failed to load platform settings:",
        error
      );

      alert(
        "Failed to load platform settings."
      );

    } finally {

      setLoading(false);

    }

  };


  // ================= HANDLE CHANGE =================

  const handleChange = (field, value) => {

    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));

  };


  // ================= SAVE SETTINGS =================

  const handleSave = async () => {

    try {

      setSaving(true);


      const payload = {
        platform_name:
          settings.platformName,

        platform_description:
          settings.platformDescription,

        maintenance_mode:
          settings.maintenanceMode,

        max_upload_size:
          Number(settings.maxUploadSize),

        allowed_formats:
          settings.allowedFormats,

        default_visibility:
          settings.defaultVisibility,

        default_language:
          settings.defaultLanguage,

        auto_processing:
          settings.autoProcessing,
      };


      const updatedData =
        await updatePlatformSettings(payload);


      const updatedSettings = {
        platformName:
          updatedData.platform_name,

        platformDescription:
          updatedData.platform_description || "",

        maintenanceMode:
          updatedData.maintenance_mode,

        maxUploadSize:
          String(updatedData.max_upload_size),

        allowedFormats:
          updatedData.allowed_formats,

        defaultVisibility:
          updatedData.default_visibility,

        defaultLanguage:
          updatedData.default_language,

        autoProcessing:
          updatedData.auto_processing,
      };


      setSettings(updatedSettings);

      setOriginalSettings(updatedSettings);


      alert(
        "Platform settings saved successfully!"
      );


    } catch (error) {

      console.error(
        "Failed to save platform settings:",
        error
      );

      alert(
        "Failed to save platform settings."
      );

    } finally {

      setSaving(false);

    }

  };


  // ================= RESET =================

  const handleReset = () => {

    setSettings(originalSettings);

  };


  // ================= LOADING =================

  if (loading) {

    return (

      <DashboardLayout>

        <div className="flex justify-center items-center h-[500px]">

          <h2 className="text-xl font-semibold">

            Loading Platform Settings...

          </h2>

        </div>

      </DashboardLayout>

    );

  }


  return (

    <DashboardLayout>

      <div className="max-w-7xl mx-auto">


        {/* ================= HEADER ================= */}

        <div className="flex items-start justify-between mb-8">


          <div>

            <h1 className="text-4xl font-bold">

              Platform Settings

            </h1>


            <p className="text-gray-500 mt-2">

              Configure general platform, video upload,
              and AI processing settings.

            </p>

          </div>


          <div className="flex gap-3">


            <button
              onClick={handleReset}
              disabled={saving}
              className="flex items-center gap-2 border border-gray-300 px-5 py-3 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
            >

              <RefreshCw size={18} />

              Reset

            </button>


            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >

              <Save size={18} />

              {saving
                ? "Saving..."
                : "Save Changes"}

            </button>


          </div>


        </div>



        {/* ================= GENERAL SETTINGS ================= */}

        <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">


          <div className="flex items-center gap-3 mb-6">


            <div className="p-3 bg-blue-100 rounded-lg">

              <Settings
                size={24}
                className="text-blue-600"
              />

            </div>


            <div>

              <h2 className="text-2xl font-bold">

                General Settings

              </h2>


              <p className="text-gray-500 mt-1">

                Configure basic platform information.

              </p>

            </div>


          </div>



          <div className="space-y-6">


            <div>

              <label className="block font-medium mb-2">

                Platform Name

              </label>


              <input
                type="text"
                value={settings.platformName}
                onChange={(e) =>
                  handleChange(
                    "platformName",
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>



            <div>

              <label className="block font-medium mb-2">

                Platform Description

              </label>


              <textarea
                rows="4"
                value={settings.platformDescription}
                onChange={(e) =>
                  handleChange(
                    "platformDescription",
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />

            </div>



            <div className="flex items-center justify-between border rounded-lg p-4">


              <div>

                <h3 className="font-semibold">

                  Maintenance Mode

                </h3>


                <p className="text-gray-500 text-sm mt-1">

                  Temporarily restrict platform access
                  for maintenance.

                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  handleChange(
                    "maintenanceMode",
                    !settings.maintenanceMode
                  )
                }
                className={`relative w-14 h-7 rounded-full transition ${
                  settings.maintenanceMode
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              >

                <span
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition ${
                    settings.maintenanceMode
                      ? "left-8"
                      : "left-1"
                  }`}
                />

              </button>


            </div>


          </div>


        </div>



        {/* ================= VIDEO UPLOAD SETTINGS ================= */}

        <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">


          <div className="flex items-center gap-3 mb-6">


            <div className="p-3 bg-blue-100 rounded-lg">

              <Upload
                size={24}
                className="text-blue-600"
              />

            </div>


            <div>

              <h2 className="text-2xl font-bold">

                Video Upload Settings

              </h2>


              <p className="text-gray-500 mt-1">

                Configure video upload restrictions and defaults.

              </p>

            </div>


          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


            <div>

              <label className="block font-medium mb-2">

                Maximum Upload Size (MB)

              </label>


              <input
                type="number"
                value={settings.maxUploadSize}
                onChange={(e) =>
                  handleChange(
                    "maxUploadSize",
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>



            <div>

              <label className="block font-medium mb-2">

                Default Video Visibility

              </label>


              <select
                value={settings.defaultVisibility}
                onChange={(e) =>
                  handleChange(
                    "defaultVisibility",
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="Private">

                  Private

                </option>

                <option value="Public">

                  Public

                </option>

              </select>

            </div>


          </div>



          <div className="mt-6">


            <label className="block font-medium mb-2">

              Allowed Video Formats

            </label>


            <input
              type="text"
              value={settings.allowedFormats}
              onChange={(e) =>
                handleChange(
                  "allowedFormats",
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />


            <p className="text-sm text-gray-500 mt-2">

              Separate formats using commas.

            </p>


          </div>


        </div>



        {/* ================= AI PROCESSING SETTINGS ================= */}

        <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">


          <div className="flex items-center gap-3 mb-6">


            <div className="p-3 bg-blue-100 rounded-lg">

              <Brain
                size={24}
                className="text-blue-600"
              />

            </div>


            <div>

              <h2 className="text-2xl font-bold">

                AI Processing Settings

              </h2>


              <p className="text-gray-500 mt-1">

                Configure default AI processing behavior.

              </p>

            </div>


          </div>



          <div className="space-y-6">


            <div>

              <label className="block font-medium mb-2">

                Default Processing Language

              </label>


              <select
                value={settings.defaultLanguage}
                onChange={(e) =>
                  handleChange(
                    "defaultLanguage",
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="English">

                  English

                </option>

                <option value="Hindi">

                  Hindi

                </option>

              </select>

            </div>



            <div className="flex items-center justify-between border rounded-lg p-4">


              <div>

                <h3 className="font-semibold">

                  Automatic Processing

                </h3>


                <p className="text-gray-500 text-sm mt-1">

                  Automatically start AI processing
                  after a video is uploaded.

                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  handleChange(
                    "autoProcessing",
                    !settings.autoProcessing
                  )
                }
                className={`relative w-14 h-7 rounded-full transition ${
                  settings.autoProcessing
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              >

                <span
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition ${
                    settings.autoProcessing
                      ? "left-8"
                      : "left-1"
                  }`}
                />

              </button>


            </div>


          </div>


        </div>



        {/* ================= BOTTOM SAVE ================= */}

        <div className="flex justify-end pb-8">

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >

            <Save size={18} />

            {saving
              ? "Saving..."
              : "Save Platform Settings"}

          </button>

        </div>


      </div>

    </DashboardLayout>

  );

};


export default PlatformSettings;