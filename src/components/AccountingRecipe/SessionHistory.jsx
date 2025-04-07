import React, { useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "../../supabaseClient";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./SessionHistory.css";

const SessionHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user_id = await checkAuth();
        if (user_id) {
          await fetchSessionHistory(user_id);
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user_id = session.user.id;
    return user_id;
  };

  const fetchSessionHistory = async (user_id) => {
    try {
      //   const response = await fetch("http://127.0.0.1:8000/session_history/", {
      //     method: "GET",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   });

      const response = await axios.post(
        `http://127.0.0.1:8000/get_session_history/`,
        {
          user_id: user_id,
        }
      );

      // Sort sessions by timestamp (newest first)
      const sortedSessions = response.data.sort(
        (a, b) => new Date(b.time_stamp) - new Date(a.time_stamp)
      );

      setSessions(sortedSessions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading session history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-text">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="session-history-container">
      <div className="session-history-card">
        <div className="card-header">
          <h2 className="card-title">Session History</h2>
        </div>
        <div className="card-content">
          {sessions.map((session) => {
            const responseData = JSON.parse(session.response);

            return (
              <Accordion key={session.id} style={{ marginBottom: "10px" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${session.id}-content`}
                  id={`panel-${session.id}-header`}
                >
                  <div className="summary-content">
                    <Typography className="recipe-name">
                      Recipe {session.id}
                    </Typography>
                    <Typography className="timestamp">
                      <span className="icon">🕒</span>{" "}
                      {formatDate(session.time_stamp)}
                    </Typography>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="session-content">
                    <div className="session-header">
                      <div className="header-item">
                        <span className="icon">📄</span>
                        <span>{session.file_name}</span>
                      </div>
                      <div className="header-item">
                        <span className="icon">🏢</span>
                        <span className="capitalize">{session.industry}</span>
                      </div>
                    </div>
                    {responseData.business_overview && (
                      <div className="overview-section">
                        <h4 className="section-title">Business Overview</h4>
                        <div className="overview-grid">
                          <div className="overview-item">
                            <span className="label">Name: </span>
                            <span>{responseData.business_overview.name}</span>
                          </div>
                          <div className="overview-item">
                            <span className="label">Type: </span>
                            <span>{responseData.business_overview.type}</span>
                          </div>
                          <div className="overview-item full-width">
                            <span className="label">Sales Regions: </span>
                            <span>
                              {responseData.business_overview.sales_bifurcation.join(
                                ", "
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="recipe-section">
                      <h4 className="section-title">Recipe Details</h4>
                      <div className="recipe-grid">
                        {Object.entries(responseData).map(([key, value]) => {
                          if (key === "business_overview") return null;
                          if (!value?.points?.length) return null;

                          return (
                            <div key={key} className="recipe-item">
                              <h5 className="recipe-subtitle">
                                {key.replace(/_/g, " ")}
                              </h5>
                              <ul className="recipe-points">
                                {value.points.map((point, idx) => (
                                  <li key={idx}>{point}</li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SessionHistory;
