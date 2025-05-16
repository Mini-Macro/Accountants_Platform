import { Box, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
const FileUploadBox = ({ file, fileNumber, label, handleFileChange }) => (
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

export default FileUploadBox;
