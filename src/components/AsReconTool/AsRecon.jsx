import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./AsRecon.css";

function Prediction() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processedFile, setProcessedFile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetProgress = () => {
    setUploadProgress(0);
    setProcessedFile(null);
    setError(null);
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    resetProgress();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://accountants-server.fly.dev/26as_tool",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        // The processed file is received from the backend
        const data = await response.blob();
        setProcessedFile(data);
      } else {
        const errorData = await response.json(); // Assuming server sends error message in JSON format
        setError(errorData.message); // Update error state with server error message
      }
    } catch (error) {
      setError(`File upload failed: ${error.message}`);
    } finally {
      setIsLoading(false);
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
        <button className="upload-button" disabled={isLoading}>
          {isLoading ? "Uploading..." : "Upload TEXT File"}
        </button>
      </div>
      {isLoading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Processing your file...</p>
        </div>
      )}
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
