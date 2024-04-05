import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./Prediction.css";

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
      formData.append("file2", file);

      console.log("Making API request...");

      // Set a timeout for the API request (e.g., 10 seconds)
      // const timeoutMillis = 100000; // 100 seconds

      // Make an API request with a timeout using fetch
      // const controller = new AbortController();
      // const timeoutId = setTimeout(() => controller.abort(), timeoutMillis);

      const response = await fetch(
        "https://wandering-frost-5156.fly.dev/read_statement",
        {
          method: "POST",
          body: formData,
          // signal: controller.signal,
        }
      );

      // clearTimeout(timeoutId);

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
      a.download = "processed_file.csv"; // Set the processed file name
      a.click();
      URL.revokeObjectURL(url);
      resetProgress();
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="file-upload-container">
      <h2>Prediction Tool</h2>
      <div className="dropzone" {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag & drop a CSV file here or click to select one</p>
        <button className="upload-button">Upload CSV</button>
      </div>
      {processedFile && (
        <div className="download-container">
          <button className="download-button" onClick={downloadProcessedFile}>
            Download Processed CSV
          </button>
        </div>
      )}
    </div>
  );
}

export default Prediction;
