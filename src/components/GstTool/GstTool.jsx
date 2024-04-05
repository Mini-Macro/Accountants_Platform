import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";

const GstTool = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [searchGstin, setSearchGstin] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `https://accountants-server.fly.dev/gst_tool?SearchGstin=${searchGstin}`
      );
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSearchGstinChange = (event) => {
    setSearchGstin(event.target.value);
  };

  const handleSearch = () => {
    fetchData();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          Data from API
        </Typography>
        <TextField
          label="Search GSTIN"
          value={searchGstin}
          onChange={handleSearchGstinChange}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
        {error ? (
          <Typography color="error">{`Error: ${error}`}</Typography>
        ) : data ? (
          <div style={{ marginTop: "20px" }}>
            {/* Depending on the structure of your API response, you can map through the data and display it */}
            <TableContainer>
              <Table>
                <TableBody>
                  {/* Render each key-value pair in the data object */}
                  {Object.entries(data).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell component="th" scope="row">
                        {key}
                      </TableCell>
                      <TableCell>
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ) : (
          <Typography>No data available</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default GstTool;
