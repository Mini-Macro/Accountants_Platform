import {
  Button,
  TableRow,
  TableCell,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
const ResultTable = ({ tableData, generateAndDownloadCSV }) => (
  <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
    <Table sx={{ minWidth: 650 }} aria-label="table summary">
      <TableHead>
        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
          <TableCell sx={{ fontWeight: "bold" }}>Table Name</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
          <TableCell sx={{ fontWeight: "bold", width: "100px" }}>
            Actions
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tableData.map((item, index) => (
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
                  generateAndDownloadCSV(item.sample_data, item.table_name)
                }
                sx={{ minWidth: "auto" }}
                disabled={!item.sample_data || item.sample_data.length === 0}
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
);

export default ResultTable;
