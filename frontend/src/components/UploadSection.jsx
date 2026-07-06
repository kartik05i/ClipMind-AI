import { useState } from "react";

function UploadSection() {

    const [selectedFile, setSelectedFile] = useState(null);

    function handleFileChange(event) {

        setSelectedFile(event.target.files[0]);

    }

    return (

        <section className="py-24 text-center">

            <h2 className="text-4xl font-bold mb-8">
                Upload Your Video
            </h2>

            <input
                type="file"
                onChange={handleFileChange}
                className="mb-6"
            />

            <p className="mb-6">

                {
                    selectedFile
                    ? selectedFile.name
                    : "No file selected"
                }

            </p>

            <button className="bg-blue-600 px-8 py-3 rounded-xl">
                Upload
            </button>

        </section>

    );

}

export default UploadSection;