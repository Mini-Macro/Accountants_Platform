import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./AsRecon.css";

function Prediction() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processedFile, setProcessedFile] = useState(null);

  const resetProgress = () => {
    setUploadProgress(0);
    setProcessedFile(null);
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    console.log("File dropped:", acceptedFiles);
    const file = acceptedFiles[0];
    resetProgress();

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Making API request...");
      console.log("Form Data:", formData); // check form data before send it to backend

      const response = await fetch(
        "https://accountants-server.fly.dev/26as_tool",
        {
          method: "POST",
          body: formData,
        }
      );

      console.log("API response:", response);

      if (response.ok) {
        // The processed file is received from the backend
        const data = await response.blob();
        setProcessedFile(data);
      } else {
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("File upload failed:", error.message);
    }
  }, []);

  const downloadProcessedFile = () => {
    if (processedFile) {
      // If it's already a Blob, use it directly
      const url = URL.createObjectURL(processedFile);
      const a = document.createElement("a");
      a.href = url;
      a.download = "processed_file.xlsx"; // Set the processed file name
      a.click();
      URL.revokeObjectURL(url);
      resetProgress();
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".txt",
  });

  return (
    <div className="file-upload-container">
      <h2>26as Tool</h2>
      <div className="dropzone" {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag & drop a TEXT file here or click to select one</p>
        <button className="upload-button">Upload TEXT File</button>
      </div>
      {processedFile && (
        <div className="download-container">
          <button className="download-button" onClick={downloadProcessedFile}>
            Download Processed Excel File
          </button>
        </div>
      )}
    </div>
  );
}

export default Prediction;
