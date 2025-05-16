import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  TextField,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import FileUploadBox from "./ChildComponents/FileUploadBox";
import ResultTable from "./ChildComponents/ResultTable";

// Main component
function FileUploadModal({ open, handleClose }) {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [companyId, setCompanyId] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [tableData, setTableData] = useState([]);

  // Load mock company data when modal opens
  useEffect(() => {
    if (open) {
      // Mock data based on the company_detail table
      setCompanies([
        { company_id: "1", company_name: "Asha" },
        { company_id: "2", company_name: "SP" },
        { company_id: "3", company_name: "Paliwal" },
        { company_id: "5", company_name: "Demo" },
        { company_id: "6", company_name: "Dhoran" },
        { company_id: "7", company_name: "Dalchand Paliwal" },
      ]);
    }
  }, [open]);

  // Function to parse response data with markdown code blocks
  const parseResponseData = (data) => {
    try {
      if (typeof data === "string") {
        // Remove the markdown code block markers if they exist
        const jsonString = data
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        return JSON.parse(jsonString);
      } else if (Array.isArray(data)) {
        // If the data is already an array, use it directly
        return data;
      }
      return []; // Return empty array as fallback
    } catch (parseError) {
      console.error("Error parsing data:", parseError);
      throw new Error("Failed to parse the response data.");
    }
  };

  // we can implement useCallback for this function to avoid re-creating it on every render
  const handleFileChange = (fileNumber, event) => {
    const file = event.target.files[0];
    setError("");

    if (!file) {
      fileNumber === 1 ? setFile1(null) : setFile2(null);
      return;
    }

    // Check file type
    const validTypes = ["application/pdf", "text/plain"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload only PDF or TXT files");
      fileNumber === 1 ? setFile1(null) : setFile2(null);
      return;
    }

    // Set the appropriate file state based on fileNumber
    fileNumber === 1 ? setFile1(file) : setFile2(file);
  };

  const handleCompanyChange = (event, newValue) => {
    setSelectedCompany(newValue);
    setCompanyId(newValue ? newValue.company_id : "");
    setError("");
  };

  const handleGenerateCSV = async () => {
    // Validate inputs
    if (!file1 || !file2) {
      setError("Please upload both required files");
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

      // field names should match what the backend expects
      formData.append("reporting_requirements", file1);
      formData.append("accounting_recipe", file2);
      formData.append("client_id", companyId);

      const response = await axios.post(
        "http://127.0.0.1:8000/get_non_financial_data",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = response.data;
      console.log("Response from API:", result);

      try {
        // Use the parsing function to get structured data
        const parsedData = parseResponseData(result);
        setTableData(parsedData);
      } catch (error) {
        setError(error.message);
      }

      // Note: we don't reset the form here since user needs to see what they submitted
    } catch (error) {
      console.error("Error submitting files:", error);

      // Simple approach to ensure we always set a string as the error message
      const errorMessage = error.response?.data?.detail
        ? String(error.response.data.detail)
        : "Failed to generate CSV. Please try again.";

      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setFile1(null);
    setFile2(null);
    setCompanyId("");
    setSelectedCompany(null);
    setError("");
    setTableData([]);
    handleClose();
  };

  const handleApprove = () => {
    // Handle approve action
    console.log("Approved tables");

    // Generate all CSV files for download
    tableData.forEach((table) => {
      if (table.sample_data && table.sample_data.length > 0) {
        generateAndDownloadCSV(table.sample_data, table.table_name);
      }
    });

    // Reset the entire form after approval
    setFile1(null);
    setFile2(null);
    setCompanyId("");
    setSelectedCompany(null);
    setTableData([]);

    handleClose();
  };

  // Helper function to convert data to CSV and trigger download
  const generateAndDownloadCSV = (data, filename) => {
    // Get headers from the first data object
    const headers = Object.keys(data[0]);

    // Create CSV header row
    let csvContent = headers.join(",") + "\n";

    // Add data rows
    data.forEach((row) => {
      const values = headers.map((header) => {
        const value = row[header];
        // Handle commas, quotes and other special characters in CSV
        const formattedValue =
          value === null || value === undefined ? "" : String(value);
        return `"${formattedValue.replace(/"/g, '""')}"`;
      });
      csvContent += values.join(",") + "\n";
    });

    // Create blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up to avoid memory leaks
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="file-upload-dialog-title"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="file-upload-dialog-title" sx={{ pb: 1 }}>
        Generate Workbook
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
            {typeof error === "object" ? JSON.stringify(error) : error}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
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
                size="small"
                placeholder="Search by company name"
              />
            )}
            onChange={handleCompanyChange}
            value={selectedCompany}
            isOptionEqualToValue={(option, value) =>
              option.company_id === value?.company_id
            }
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ width: "48%" }}>
            <Typography variant="subtitle2" gutterBottom>
              Reporting Requirement File{" "}
              <Chip
                label="PDF Only"
                size="small"
                color="primary"
                sx={{
                  ml: 1,
                  fontWeight: 500,
                  background: (theme) =>
                    `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                }}
              />
            </Typography>
            <FileUploadBox
              file={file1}
              fileNumber={1}
              label="Click here to upload file"
              handleFileChange={handleFileChange}
            />
          </Box>
          <Box sx={{ width: "48%" }}>
            <Typography variant="subtitle2" gutterBottom>
              Accounting Instruction File{" "}
              <Chip
                label="PDF Only"
                size="small"
                color="primary"
                sx={{
                  ml: 1,
                  fontWeight: 500,
                  background: (theme) =>
                    `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                }}
              />
            </Typography>
            <FileUploadBox
              file={file2}
              fileNumber={2}
              label="Click here to upload file"
              handleFileChange={handleFileChange}
            />
          </Box>
        </Box>

        {tableData.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <ResultTable
              tableData={tableData}
              generateAndDownloadCSV={generateAndDownloadCSV}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                onClick={handleApprove}
                color="primary"
                variant="contained"
                sx={{ ml: 1 }}
              >
                APPROVE
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      {/* Dialog actions */}
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        {tableData.length === 0 && (
          <Button
            onClick={handleGenerateCSV}
            color="primary"
            variant="contained"
            disabled={!file1 || !file2 || !companyId || isProcessing}
            startIcon={isProcessing ? <CircularProgress size={20} /> : null}
          >
            {isProcessing ? "Processing..." : "Generate CSV"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default FileUploadModal;
