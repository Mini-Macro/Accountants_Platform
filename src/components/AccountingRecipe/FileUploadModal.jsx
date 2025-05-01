import React, { useState, useEffect } from "react";
import responseData from "./response.json"; // Mock data for testing
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";

// Modal component for file upload
function FileUploadModal({ open, handleClose }) {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [companyId, setCompanyId] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTableSummary, setShowTableSummary] = useState(false);

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

    try {
      // Create FormData object to send files and data
      const formData = new FormData();
      formData.append("file1", file1);
      formData.append("file2", file2);
      formData.append("client_id", companyId);

      // Send data to backend API using axios
      const response = await axios.post(
        "http://localhost:8000/get_financial_data",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = response.data;
      console.log("Response from API:", result);

      // Show the table summary after successful API call
      setShowTableSummary(true);

      // Note: we don't reset the form here since user needs to see what they submitted
    } catch (error) {
      console.error("Error submitting files:", error);
      const errorMessage =
        error.response?.data?.detail ||
        "Failed to generate CSV. Please try again.";
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
    setShowTableSummary(false);
    handleClose();
  };

  const handleApprove = () => {
    // Handle approve action
    console.log("Approved tables");

    // Generate all CSV files for download
    responseData.forEach((table) => {
      if (table.sample_data && table.sample_data.length > 0) {
        generateAndDownloadCSV(table.sample_data, table.table_name);
      }
    });

    // Reset the entire form after approval
    setFile1(null);
    setFile2(null);
    setCompanyId("");
    setSelectedCompany(null);
    setShowTableSummary(false);

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
  };

  const FileUploadBox = ({ file, fileNumber, label }) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "2px dashed #1976d2",
        borderRadius: 2,
        p: 2,
        textAlign: "center",
        cursor: "pointer",
        height: "110px",
        backgroundColor: "rgba(25, 118, 210, 0.02)",
        "&:hover": {
          borderColor: "#1976d2",
          bgcolor: "rgba(25, 118, 210, 0.05)",
        },
      }}
      component="label"
    >
      <input
        type="file"
        accept=".pdf,.txt"
        hidden
        onChange={(e) => handleFileChange(fileNumber, e)}
      />
      <CloudUploadIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
      <Typography variant="body2">{file ? file.name : label}</Typography>
    </Box>
  );

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
            {error}
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
              Reporting Requirement File:
            </Typography>
            <FileUploadBox
              file={file1}
              fileNumber={1}
              label="Click here to upload file"
            />
          </Box>
          <Box sx={{ width: "48%" }}>
            <Typography variant="subtitle2" gutterBottom>
              Accounting Instruction File:
            </Typography>
            <FileUploadBox
              file={file2}
              fileNumber={2}
              label="Click here to upload file"
            />
          </Box>
        </Box>

        {showTableSummary && (
          <Box sx={{ mt: 3 }}>
            <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
              <Table sx={{ minWidth: 650 }} aria-label="table summary">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Table Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Description
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: "100px" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {responseData.map((item, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:nth-of-type(odd)": {
                          backgroundColor: "rgba(0, 0, 0, 0.02)",
                        },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {item.table_name}
                      </TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<DownloadIcon />}
                          onClick={() =>
                            generateAndDownloadCSV(
                              item.sample_data,
                              item.table_name
                            )
                          }
                          sx={{ minWidth: "auto" }}
                          disabled={
                            !item.sample_data || item.sample_data.length === 0
                          }
                          title="Preview CSV"
                        >
                          CSV
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

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
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        {!showTableSummary && (
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
