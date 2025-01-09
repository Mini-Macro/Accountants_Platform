import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import SideBar from "./SideBar";
import Box from "@mui/material/Box";
import SignIn from "./SignIn";
import { supabase } from "./supabaseClient";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log("session", session);
    if (session) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  const updateAppState = (dataFromSignin) => {
    setIsAuthenticated(dataFromSignin);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#333",
          fontSize: "1.5rem",
          fontWeight: "bold",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div className="app-container">
      {isAuthenticated ? (
        <>
          <Box height={65} />
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
