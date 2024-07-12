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
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

// FlattenObject function
const flattenObject = (obj) => {
  const result = {};
  const stack = [{ prefix: "", value: obj }];

  while (stack.length > 0) {
    const { prefix, value } = stack.pop();

    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          stack.push({
            prefix: `${prefix}${prefix ? "_" : ""}${index}`,
            value: item,
          });
        });
      } else {
        Object.keys(value).forEach((key) => {
          stack.push({
            prefix: `${prefix}${prefix ? "_" : ""}${key}`,
            value: value[key],
          });
        });
      }
    } else {
      result[prefix] = value;
    }
  }

  return result;
};

const GstTool = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [searchGstin, setSearchGstin] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `https://accountants-server.fly.dev/gst_tool?SearchGstin=${searchGstin}`
      );
      console.log(response.data);
      const flattenedData = flattenObject(response.data);
      setData(flattenedData);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleSearchGstinChange = (event) => {
    setSearchGstin(event.target.value);
  };

  const handleSearch = () => {
    fetchData();
  };

  // const getCsv = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const response = await axios.post(
  //       "http://127.0.0.1:8000/generate_csv_multiple",
  //       null,
  //       {
  //         params: {
  //           gst_numbers: searchGstin,
  //         },
  //         responseType: "blob",
  //       }
  //     );

  //     const blob = new Blob([response.data], { type: "text/csv" });
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = "gst_data.csv";
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //   } catch (err) {
  //     setError("Failed to generate CSV");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
        <Button variant="contained" onClick={handleSearch} disabled={loading}>
          Search
        </Button>
        {/* <Button variant="contained" onClick={getCsv} disabled={loading}>
          Get Csv
        </Button> */}
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <CircularProgress />
          </div>
        ) : error ? (
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
