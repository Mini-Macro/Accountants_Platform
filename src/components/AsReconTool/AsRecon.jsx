import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./AsRecon.css";

function Prediction() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processedFile, setProcessedFile] = useState(null);
  const [error, setError] = useState(null);

  const resetProgress = () => {
    setUploadProgress(0);
    setProcessedFile(null);
    setError(null);
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    // console.log("File dropped:", acceptedFiles);
    const file = acceptedFiles[0];
    resetProgress();

    try {
      const formData = new FormData();
      formData.append("file", file);

      // console.log("Making API request...");
      // console.log("Form Data:", formData);

      const response = await fetch(
        "https://accountants-server.fly.dev/26as_tool",
        {
          method: "POST",
          body: formData,
        }
      );

      // console.log("API response:", response);

      if (response.ok) {
        // The processed file is received from the backend
        const data = await response.blob();
        setProcessedFile(data);
      } else {
        const errorData = await response.json(); // Assuming server sends error message in JSON format
        setError(errorData.message); // Update error state with server error message
        // console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      // console.error("File upload failed:", error.message);
      setError(`File upload failed: ${error.message}`);
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
      {error && <div className="error-message">{error}</div>}{" "}
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
