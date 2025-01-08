import React, { useState, useEffect } from "react";
import "./AccountingRecipe.css";
import axios from "axios";

const AccountingRecipe = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const STORAGE_KEY = "accountingRecipeData";

  useEffect(() => {
    const savedData = sessionStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setResponse(parsedData);
      } catch (error) {
        console.error("Error parsing saved data:", error);
      }
    }
  }, []);

  const industries = [
    "Transport",
    "Manufacturing",
    "Retail",
    "Healthcare",
    "Technology",
    "Financial Services",
    "Construction",
    "Hospitality",
    "Education",
  ];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.name.endsWith(".txt")) {
        setError("Only .txt files are accepted");
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await axios.post("http://127.0.0.1:8000/session_history/", {
        file_name: selectedFile.name,
        industry: selectedIndustry,
        response: JSON.stringify(response),
        user_id: "23126e86-8ae4-41bd-9d22-21937a7f2378",
      });
      setSuccessMessage("Recipe saved successfully");
    } catch (error) {
      setError("Failed to save the recipe: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !selectedIndustry) {
      setError("Please select both an industry and a file");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Create FormData object to send multipart/form-data
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("industry", selectedIndustry);

      const response = await fetch("http://127.0.0.1:8000/upload-files/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to upload file");
      }

      const data = await response.json();
      const parsedData = JSON.parse(data.response);

      // Save the parsed data to sessionStorage
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData));
      setResponse(parsedData);
    } catch (err) {
      setError(
        err.message || "An error occurred while processing your request"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderSection = (title, points) => {
    if (!points || points.length === 0) return null;

    return (
      <div className="response-section">
        <h3 className="section-title">{title}</h3>
        <div className="points-list">
          {points.map((point, index) => (
            <div key={index} className="point-item">
              {point}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`upload-container ${response ? "with-response" : ""}`}>
      <div className="upload-card">
        <div className="card-header">
          <h2>Generate Accounting Recipe</h2>
          <p>Upload your document and select your industry type</p>
        </div>

        <div className="card-content">
          <div className="input-group">
            <label>Industry Type</label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="industry-select"
            >
              <option value="">Select industry</option>
              {industries.map((industry) => (
                <option key={industry} value={industry.toLowerCase()}>
                  {industry}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Document Upload</label>
            <div
              className="upload-area"
              onClick={() => document.getElementById("file-upload").click()}
            >
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept=".txt"
                className="file-input"
              />
              {selectedFile ? (
                <div className="file-info">
                  <div className="file-icon">📄</div>
                  <span>{selectedFile.name}</span>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon">⭐</div>
                  <span>Click to upload or drag and drop</span>
                  <span className="file-types">TXT files only (max 10MB)</span>
                </div>
              )}
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
        </div>

        <div className="card-footer">
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={!selectedFile || !selectedIndustry || isLoading}
          >
            {isLoading ? "Generating..." : "Generate Recipe"}
          </button>
        </div>
      </div>

      {response && (
        <div className="response-container">
          <div className="response-header">
            <h2 className="container-title">Detailed Recipe</h2>
            <button
              className="save-button"
              onClick={handleSave}
              disabled={!response}
            >
              {isLoading && response ? "Saving..." : "Save Recipe"}
            </button>
          </div>

          <div className="response-section">
            <h3 className="section-title">Business Overview</h3>
            <div className="key-value-grid">
              <div className="key-value-pair">
                <span className="key">Industry Type:</span>
                <span className="value">
                  {response.business_overview.industry_type}
                </span>
              </div>
              <div className="key-value-pair">
                <span className="key">Name:</span>
                <span className="value">{response.business_overview.name}</span>
              </div>
              <div className="key-value-pair">
                <span className="key">Type:</span>
                <span className="value">{response.business_overview.type}</span>
              </div>
              <div className="key-value-pair">
                <span className="key">Sales Regions:</span>
                <span className="value">
                  {response.business_overview.sales_bifurcation.join(", ")}
                </span>
              </div>
            </div>
          </div>

          {renderSection("Capital", response.capital?.points)}
          {renderSection(
            "Cash and Cash Equivalent",
            response.cash_and_cash_equivalent?.points
          )}
          {renderSection("Duties and Taxes", response.duties_and_taxes?.points)}
          {renderSection(
            "Indirect Expenses",
            response.indirect_expenses?.points
          )}
          {renderSection("Opening Balances", response.opening_balances?.points)}
          {renderSection("Purchases", response.purchases?.points)}
          {renderSection("Sales", response.sales?.points)}
          {renderSection("Sales Return", response.sales_return?.points)}
          {renderSection("Secured Loans", response.secured_loans?.points)}
          {renderSection("Sundry Creditors", response.sundry_creditors?.points)}
          {renderSection("Sundry Debtors", response.sundry_debtors?.points)}
        </div>
      )}
    </div>
  );
};

export default AccountingRecipe;
