import React, { useState, useRef } from "react";
import { Button, Typography, Box } from "@mui/material";
import axios from "axios";
import "./BulkReplacer.css";

function BulkReplacer() {
  // const initialFilesState = {
  //   input: null,
  //   mapping: null,
  // };

  const [files, setFiles] = useState({ input: null, mapping: null });
  const [replacedFileContent, setReplacedFileContent] = useState(null);
  const [error, setError] = useState(null); // State for holding error message
  const [isLoading, setIsLoading] = useState(false);

  const inputFileRef = useRef(null);
  const mappingFileRef = useRef(null);

  const handleFileUpload = (event, fileType) => {
    setFiles((prevFiles) => ({
      ...prevFiles,
      [fileType]: event.target.files[0],
    }));
  };

  const resetState = () => {
    setFiles({ input: null, mapping: null });
    setReplacedFileContent(null);
    setError(null);
    if (inputFileRef.current) inputFileRef.current.value = "";
    if (mappingFileRef.current) mappingFileRef.current.value = "";
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("input_file", files.input);
    formData.append("mapping_file", files.mapping);

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://accountants-server.fly.dev/bulk_replacer_tool",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob", // Ensure that the response is treated as a blob
        }
      );

      // console.log("Files uploaded successfully");
      setReplacedFileContent(response.data); // Store response body in state variable
    } catch (error) {
      // console.error("Error uploading files:", error);
      setError("Error uploading files. Please try again.");
      setReplacedFileContent(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (replacedFileContent) {
      const url = window.URL.createObjectURL(new Blob([replacedFileContent]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "output.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      resetState();
    }
  };

  return (
    <Box className="bulkreplacer-container">
      <h2>Bulk Replacer</h2>
      <Typography variant="h6">Input File:</Typography>
      <input
        type="file"
        accept=".csv"
        onChange={(event) => handleFileUpload(event, "input")}
        className="bulkreplacer-file-input"
        ref={inputFileRef}
      />
      <Typography variant="h6">Mapping File:</Typography>
      <input
        type="file"
        accept=".csv"
        onChange={(event) => handleFileUpload(event, "mapping")}
        className="bulkreplacer-file-input"
        ref={mappingFileRef}
      />
      <Button
        variant="contained"
        component="label"
        onClick={handleUpload}
        className="bulkreplacer-upload-button"
        disabled={!files.input || !files.mapping}
      >
        Upload Files
      </Button>
      {isLoading && <p>Processing your file...</p>}
      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}{" "}
      {/* Display error message */}
      {replacedFileContent && (
        <Box className="bulkreplacer-result-section">
          <Typography variant="body1">
            New File with old names replaced:
          </Typography>
          <Button
            variant="contained"
            component="label"
            color="success"
            onClick={handleDownload}
            className="bulkreplacer-download-button"
          >
            Download Replaced File
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default BulkReplacer;
