import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  FormHelperText,
} from "@mui/material";
import axios from "axios";

const GstTool = () => {
  const [error, setError] = useState(null);
  const [searchGstin, setSearchGstin] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSearchGstinChange = (event) => {
    setSearchGstin(event.target.value);
  };

  const getCsv = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/generate_csv_multiple",
        null,
        {
          params: {
            gst_numbers: searchGstin,
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "gst_data.csv";
      a.click();
      window.URL.revokeObjectURL(url);
      setSnackbarOpen(true);
    } catch (err) {
      setError("Failed to generate CSV");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "0 auto", mt: 5, p: 3 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          GSTINs Tool
        </Typography>
        <TextField
          label="Enter GSTIN(s)"
          value={searchGstin}
          onChange={handleSearchGstinChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <FormHelperText sx={{ mb: 2, fontSize: "14px" }}>
          Enter comma-separated GSTINs
        </FormHelperText>
        <Button
          variant="contained"
          onClick={getCsv}
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : "Download CSV"}
        </Button>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {`Error: ${error}`}
          </Typography>
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="success">
            CSV file downloaded successfully!
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default GstTool;
