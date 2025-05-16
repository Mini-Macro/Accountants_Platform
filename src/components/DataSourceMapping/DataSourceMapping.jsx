import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  TextField,
  Autocomplete,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { parseResponseData } from "../../utils/responseCleaner";
import {
  Document,
  Packer,
  Paragraph,
  Table as DocxTable,
  TableRow as DocxTableRow,
  TableCell as DocxTableCell,
  HeadingLevel,
  BorderStyle,
} from "docx";
import { saveAs } from "file-saver";
import axios from "axios";

// FileUploadBox component for file upload
const FileUploadBox = ({
  files,
  fileNumber,
  label,
  handleFileChange,
  multiple = false,
}) => {
  const inputId = `file-upload-${fileNumber}`;

  // Check if files are uploaded
  const hasFiles = multiple ? files && files.length > 0 : !!files;

  // Create a ref for the file input
  const fileInputRef = React.useRef(null);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          border: "1px dashed #2196f3",
          borderRadius: 2,
          p: 3,
          minHeight: "120px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          bgcolor: "#f0f8ff",
          "&:hover": {
            bgcolor: "#e3f2fd",
          },
          width: "100%",
          mb: 1,
        }}
        component="label"
        htmlFor={inputId}
      >
        <input
          id={inputId}
          ref={fileInputRef}
          type="file"
          hidden
          onChange={(e) => {
            // Process the file change
            handleFileChange(fileNumber, e);
            // Reset the input value so the same file can be selected again
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
          multiple={multiple}
          accept=".pdf,.txt,.csv"
        />

        {/* Always show the upload icon and text */}
        <>
          {/* Cloud upload icon */}
          <Box
            sx={{
              color: "#2196f3",
              fontSize: 40,
              mb: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04ZM14 13V17H10V13H7L12 8L17 13H14Z"
                fill="#2196f3"
              />
            </svg>
          </Box>
          <Typography variant="body2" color="text.secondary" align="center">
            {label}
          </Typography>
        </>
      </Box>

      {/* Display files below the upload box */}
      {hasFiles && (
        <Box
          sx={{
            mt: 2,
            mb: 2,
            maxHeight: "140px",
            overflow: "auto", // Enable scrolling when content exceeds height
            "&::-webkit-scrollbar": {
              width: "6px",
              height: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#bbbbbb",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          {multiple ? (
            // Multiple files display - show all files
            files.map((file, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  mb: 1,
                  bgcolor: "#fff",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mr: 1,
                    color: "#2196f3",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14,2H6C4.9,2,4,2.9,4,4v16c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V8L14,2z M18,20H6V4h7v5h5V20z"
                      fill="currentColor"
                    />
                  </svg>
                </Box>
                <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                  {file.name}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Remove this file from the array
                    const newFiles = [...files];
                    newFiles.splice(index, 1);
                    // Update with a synthetic event
                    handleFileChange(
                      fileNumber,
                      { target: { files: newFiles } },
                      true
                    );
                  }}
                  sx={{ color: "#757575" }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                      fill="currentColor"
                    />
                  </svg>
                </IconButton>
              </Box>
            ))
          ) : (
            // Single file display
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 1,
                bgcolor: "#fff",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mr: 1,
                  color: "#2196f3",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14,2H6C4.9,2,4,2.9,4,4v16c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V8L14,2z M18,20H6V4h7v5h5V20z"
                    fill="currentColor"
                  />
                </svg>
              </Box>
              <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                {files.name}
              </Typography>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Clear the file
                  handleFileChange(fileNumber, { target: { files: [] } });
                }}
                sx={{ color: "#757575" }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                    fill="currentColor"
                  />
                </svg>
              </IconButton>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

// Main component
function DataSourceMapping() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState([]);
  const [companyId, setCompanyId] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [jsonResponse, setJsonResponse] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Load mock company data
  useEffect(() => {
    // Mock data based on the company_detail table
    setCompanies([
      { company_id: "1", company_name: "Asha" },
      { company_id: "2", company_name: "SP" },
      { company_id: "3", company_name: "Paliwal" },
      { company_id: "5", company_name: "Demo" },
      { company_id: "6", company_name: "Dhoran" },
      { company_id: "7", company_name: "Dalchand Paliwal" },
    ]);
  }, []);

  const handleFileChange = (fileNumber, event, isCustomEvent = false) => {
    setError("");

    if (fileNumber === 1) {
      // First file box - single file
      const file = isCustomEvent ? null : event.target.files[0];
      if (!file) {
        setFile1(null);
        return;
      }

      // Check file type
      const validTypes = ["application/pdf", "text/plain"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload only PDF or TXT files");
        setFile1(null);
        return;
      }

      setFile1(file);
    } else {
      // Second file box - multiple files
      if (isCustomEvent) {
        // This is a custom event (e.g., from removing a file)
        setFile2(event.target.files);
        return;
      }

      // This is a standard file input event
      const newFiles = Array.from(event.target.files);

      if (newFiles.length === 0) {
        return;
      }

      // Check file types for all files
      const validTypes = ["application/pdf", "text/plain", "text/csv"];
      const allValid = newFiles.every((file) => validTypes.includes(file.type));

      if (!allValid) {
        setError("Please upload only PDF or TXT files");
        return;
      }

      // Add the new files to the existing ones instead of replacing them
      setFile2((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleCompanyChange = (event, newValue) => {
    setSelectedCompany(newValue);
    setCompanyId(newValue ? newValue.company_id : "");
    setError("");
  };

  const handleSubmit = async () => {
    // Validate inputs
    if (!file1) {
      setError("Please upload the first file");
      return;
    }

    if (file2.length === 0) {
      setError("Please upload at least one file in the second input");
      return;
    }

    if (!companyId) {
      setError("Please select a company");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Create FormData object to send files and data
      const formData = new FormData();

      // Append the first file
      formData.append("reporting_requirements", file1);

      // Append all files from the second input
      file2.forEach((file) => {
        formData.append(`additional_files`, file);
      });

      // Append company ID
      formData.append("client_id", companyId);

      // Log the total number of files being sent
      console.log("Sending files to backend:");
      console.log("- 1 reporting requirement file:", file1.name);
      console.log(
        `- ${file2.length} accounting instruction files:`,
        file2.map((f) => f.name).join(", ")
      );
      console.log("Total files:", 1 + file2.length);

      const response = await axios.post(
        "http://127.0.0.1:8000/generate-reporting-suggestions/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Clean response data
      const parsedResponse = parseResponseData(response.data.response);

      // Store the JSON response
      setJsonResponse(parsedResponse);
      console.log("Response from API:", parsedResponse);
    } catch (error) {
      console.error("Error submitting files:", error);

      const errorMessage = error.response?.data?.detail
        ? String(error.response.data.detail)
        : "Failed to process. Please try again.";

      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const exportToWord = () => {
    try {
      setIsExporting(true);

      if (!jsonResponse || jsonResponse.length === 0) {
        setError("No data available to export");
        return;
      }

      // Create table rows for the header
      const tableRows = [
        new DocxTableRow({
          tableHeader: true,
          children: [
            new DocxTableCell({
              shading: { fill: "#f5f5f5" },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "#e0e0e0" },
                bottom: {
                  style: BorderStyle.SINGLE,
                  size: 1,
                  color: "#e0e0e0",
                },
                left: { style: BorderStyle.SINGLE, size: 1, color: "#e0e0e0" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "#e0e0e0" },
              },
              children: [new Paragraph("Reporting Requirement")],
            }),
            new DocxTableCell({
              shading: { fill: "#f5f5f5" },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "#e0e0e0" },
                bottom: {
                  style: BorderStyle.SINGLE,
                  size: 1,
                  color: "#e0e0e0",
                },
                left: { style: BorderStyle.SINGLE, size: 1, color: "#e0e0e0" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "#e0e0e0" },
              },
              children: [new Paragraph("Visual")],
            }),
            new DocxTableCell({
              shading: { fill: "#f5f5f5" },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "#e0e0e0" },
                bottom: {
                  style: BorderStyle.SINGLE,
                  size: 1,
                  color: "#e0e0e0",
                },
                left: { style: BorderStyle.SINGLE, size: 1, color: "#e0e0e0" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "#e0e0e0" },
              },
              children: [new Paragraph("Table Names")],
            }),
            new DocxTableCell({
              shading: { fill: "#f5f5f5" },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "#e0e0e0" },
                bottom: {
                  style: BorderStyle.SINGLE,
                  size: 1,
                  color: "#e0e0e0",
                },
                left: { style: BorderStyle.SINGLE, size: 1, color: "#e0e0e0" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "#e0e0e0" },
              },
              children: [new Paragraph("Column Names")],
            }),
          ],
        }),
      ];

      // Add data rows
      jsonResponse.forEach((item) => {
        tableRows.push(
          new DocxTableRow({
            children: [
              new DocxTableCell({
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1, color: "#e0e0e0" },
                  bottom: {
                    style: BorderStyle.SINGLE,
                    size: 1,
                    color: "#e0e0e0",
                  },
                  left: {
                    style: BorderStyle.SINGLE,
                    size: 1,
                    color: "#e0e0e0",
                  },
                  right: {
                    style: BorderStyle.SINGLE,
                    size: 1,
                    color: "#e0e0e0",
                  },
                },
                children: [new Paragraph(item["Reporting Requirement"] || "")],
              }),
              new DocxTableCell({
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1, color: "#e0e0e0" },
                  bottom: {
                    style: BorderStyle.SINGLE,
                    size: 1,
                    color: "#e0e0e0",
                  },
                  left: {
                    style: BorderStyle.SINGLE,
                    size: 1,
                    color: "#e0e0e0",
                  },
                  right: {
                    style: BorderStyle.SINGLE,
                    size: 1,
                    color: "#e0e0e0",
                  },
                },
                children: [new Paragraph(item["Visual"] || "")],
              }),
              new DocxTableCell({
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1, color: "#e0e0e0" },
                  bottom: {
                    style: BorderStyle.SINGLE,
                    size: 1,
                    color: "#e0e0e0",
                  },
                  left: {
                    style: BorderStyle.SINGLE,
                    size: 1,
                    color: "#e0e0e0",
                  },
                  right: {
                    style: BorderStyle.SINGLE,
                    size: 1,
                    color: "#e0e0e0",
                  },
                },
                children: [new Paragraph(item["Table Names"] || "")],
              }),
              new DocxTableCell({
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1, color: "#e0e0e0" },
                  bottom: {
                    style: BorderStyle.SINGLE,
                    size: 1,
                    color: "#e0e0e0",
                  },
                  left: {
                    style: BorderStyle.SINGLE,
                    size: 1,
                    color: "#e0e0e0",
                  },
                  right: {
                    style: BorderStyle.SINGLE,
                    size: 1,
                    color: "#e0e0e0",
                  },
                },
                children: [new Paragraph(item["Column Names"] || "")],
              }),
            ],
          })
        );
      });

      // Create the document with the table
      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 1440,
                  right: 1440,
                  bottom: 1440,
                  left: 1440,
                },
              },
            },
            children: [
              new Paragraph({
                text: "Reporting Requirements",
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                text: `Company: ${
                  selectedCompany ? selectedCompany.company_name : "N/A"
                }`,
                spacing: {
                  after: 200,
                },
              }),
              new DocxTable({
                width: {
                  size: 100,
                  type: "pct",
                },
                rows: tableRows,
              }),
            ],
          },
        ],
      });

      // Generate and save the document
      Packer.toBlob(doc)
        .then((blob) => {
          saveAs(
            blob,
            `Reporting_Requirements_${
              selectedCompany?.company_name || "Export"
            }.docx`
          );
        })
        .catch((error) => {
          console.error("Error generating Word document:", error);
          setError("Failed to export to Word document. Please try again.");
        });
    } catch (error) {
      console.error("Error exporting to Word:", error);
      setError("Failed to export to Word document. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };
  // Determine if we should show the table UI layout
  const showTable = jsonResponse !== null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
        height: "100%",
        mt: 4,
      }}
    >
      <Box
        sx={{
          width: showTable ? "100%" : "650px", // Fixed width that matches your reference image
          transition: "width 0.3s ease",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 1,
            display: "flex",
            flexDirection: showTable ? "row" : "column",
            gap: 3,
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            height: showTable ? "calc(100vh - 120px)" : "auto",
            overflow: "hidden",
          }}
        >
          {/* Left section - Upload form */}
          <Box
            sx={{
              width: showTable ? "45%" : "100%",
              display: "flex",
              flexDirection: "column",
              height: showTable ? "100%" : "auto",
              overflow: "hidden",
            }}
            className="left-section"
          >
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
              Generate Workbook
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                Company:
              </Typography>
              <Autocomplete
                options={companies}
                getOptionLabel={(option) =>
                  `${option.company_name} - ${option.company_id}`
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    placeholder="Search by company name"
                    variant="outlined"
                  />
                )}
                onChange={handleCompanyChange}
                value={selectedCompany}
                isOptionEqualToValue={(option, value) =>
                  option.company_id === value?.company_id
                }
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 3,
                mb: 4,
                flexDirection: { xs: "column", md: "row" }, // Stack on mobile, horizontal on larger screens
              }}
            >
              {/* First file upload box */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                  Reporting Requirement File:
                </Typography>
                <FileUploadBox
                  files={file1}
                  fileNumber={1}
                  label="Click here to upload file"
                  handleFileChange={handleFileChange}
                />
              </Box>

              {/* Second file upload box */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                  Non-Financial Data Files:
                </Typography>
                <FileUploadBox
                  files={file2}
                  fileNumber={2}
                  label="Click here to upload file"
                  handleFileChange={handleFileChange}
                  multiple={true}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={
                  !file1 || file2.length === 0 || !companyId || isProcessing
                }
                startIcon={isProcessing ? <CircularProgress size={20} /> : null}
                sx={{
                  bgcolor: "#1976d2",
                  color: "#ffffff",
                  "&:hover": { bgcolor: "#1565c0" },
                  borderRadius: 1,
                  textTransform: "uppercase",
                  px: 3,
                  py: 1,
                  fontWeight: 500,
                  boxShadow:
                    "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
                }}
              >
                {isProcessing ? "Processing..." : "SUBMIT"}
              </Button>
            </Box>
          </Box>

          {/* Right section - Results table */}
          {showTable && (
            <Box
              sx={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
              className="right-section"
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Results
                </Typography>
                {jsonResponse && jsonResponse.length > 0 && (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={exportToWord}
                    disabled={isExporting}
                    startIcon={
                      isExporting ? (
                        <CircularProgress size={20} />
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
                            fill="currentColor"
                          />
                        </svg>
                      )
                    }
                  >
                    {isExporting ? "Exporting..." : "Export to Word"}
                  </Button>
                )}
              </Box>
              <TableContainer
                component={Paper}
                sx={{
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                  flex: 1,
                  overflow: "auto", // Enable scrolling
                  "&::-webkit-scrollbar": {
                    width: "8px",
                    height: "8px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#bbbbbb",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                      <TableCell>Reporting Requirement</TableCell>
                      <TableCell>Visual</TableCell>
                      <TableCell>Table Names</TableCell>
                      <TableCell>Column Names</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* We'll fill this with data from the jsonResponse later */}
                    {jsonResponse &&
                      jsonResponse.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item["Reporting Requirement"]}</TableCell>
                          <TableCell>{item["Visual"]}</TableCell>
                          <TableCell>{item["Table Names"]}</TableCell>
                          <TableCell>{item["Column Names"]}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default DataSourceMapping;
