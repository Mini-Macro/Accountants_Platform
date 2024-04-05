import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import SideBar from "./SideBar";
import Box from "@mui/material/Box";
import SignIn from "./SignIn";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const updateAppState = (dataFromSignin) => {
    setIsAuthenticated(dataFromSignin);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <Box height={100} />
          <SideBar onLogout={handleLogout} />
        </>
      ) : (
        <>
          <Routes>
            <Route
              path="/"
              element={<SignIn onLoginUpdate={updateAppState} />}
            />
            {/* Redirect to login if the user tries to access other routes */}
            <Route
              path="/*"
              element={<SignIn onLoginUpdate={updateAppState} />}
            />
          </Routes>
        </>
      )}
    </div>
  );
}

export default App;
