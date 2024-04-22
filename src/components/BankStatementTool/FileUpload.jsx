import React, { useState } from "react";
import axios from "axios";
import { Button, Box, Typography, Select, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";

const Input = styled("input")({
  display: "none",
});

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedBank, setSelectedBank] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null); // Download URL state
  const [error, setError] = useState(null); // State for holding error message

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    // console.log(selectedFile);
  };

  const handleBankChange = (event) => {
    setSelectedBank(event.target.value);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("pdf_file", selectedFile);
    formData.append("bank_name", selectedBank);
    // console.log("Sending File................");
    try {
      const response = await axios.post(
        "https://accountants-server.fly.dev/bank_ststement_tool",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob", // Ensure that the response is treated as a blob
        }
      );

      // console.log("Files uploaded successfully");
      setDownloadUrl(response.data);
      setError(null); // Reset error state
      // console.log(response.data); // Store response body in state variable
    } catch (error) {
      // console.error("Error uploading file:", error);
      // Handle error states accordingly
      setError("Error uploading file. Please try again."); // Update error state with error message
    }
  };

  const handleDownloadComplete = () => {
    if (downloadUrl) {
      const url = window.URL.createObjectURL(new Blob([downloadUrl]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "converted.xlsx");
      document.body.appendChild(link);
      link.click();
    }
    setSelectedFile(null);
    setSelectedBank("");
    setDownloadUrl(null);
    setError(null); // Reset error state
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <h2
        style={{
          fontSize: "30px",
          color: "#595959",
          fontWeight: 600,
          marginBottom: "20px",
        }}
      >
        Bank Statement Tool
      </h2>
      <Typography variant="h6">Select Bank Name</Typography>
      <Select
        value={selectedBank}
        onChange={handleBankChange}
        variant="outlined"
        displayEmpty
        sx={{
          marginBottom: 2,
          "& .MuiOutlinedInput-input": {
            padding: "10px",
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            backgroundColor: "#f5f5f5",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#bdbdbd",
          },
        }}
      >
        <MenuItem value="" disabled>
          Select Bank
        </MenuItem>
        <MenuItem value="BOM Bank">BOM Bank</MenuItem>
        <MenuItem value="Canara Bank">Canara Bank</MenuItem>
        <MenuItem value="ICICI Bank">ICICI Bank</MenuItem>
        <MenuItem value="IDFC Bank">IDFC Bank</MenuItem>
        <MenuItem value="SBI Bank">SBI Bank</MenuItem>
        <MenuItem value="Other Banks">Other Banks</MenuItem>
      </Select>
      <Typography variant="h6">Upload PDF Bank Statement</Typography>
      <label htmlFor="contained-button-file">
        <Input
          accept="application/pdf"
          id="contained-button-file"
          multiple
          type="file"
          onChange={handleFileChange}
        />
        <Button
          variant="contained"
          component="span"
          // startIcon={<CloudUploadIcon />}
        >
          Upload PDF
        </Button>
      </label>
      {selectedFile && <Typography>File: {selectedFile.name}</Typography>}
      {selectedBank && selectedFile && (
        <Button
          variant="contained"
          color="primary"
          onClick={uploadFile}
          disabled={!selectedFile}
        >
          Upload and Process
        </Button>
      )}
      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}{" "}
      {/* Display error message */}
      {downloadUrl && (
        <Box>
          <Typography variant="body1">Conversion Complete!</Typography>
          <Button
            variant="contained"
            component="label"
            color="success"
            // href={downloadUrl}
            // startIcon={<GetAppIcon />}
            // download
            onClick={handleDownloadComplete}
          >
            Download Excel
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
