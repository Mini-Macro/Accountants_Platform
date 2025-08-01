import React, { useState, useEffect } from "react";
import "./AccountingRecipe.css";
import axios from "axios";
import { Document, Packer, Paragraph, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import { supabase } from "../../supabaseClient";
import FileUploadModal from "./FileUploadModal";

const AccountingRecipe = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const STORAGE_KEY = "accountingRecipeData";
  const INDUSTRY_KEY = "accountingRecipeIndustry";
  const FILE_KEY = "accountingRecipeFile";

  useEffect(() => {
    // Load saved data from session storage
    const savedData = sessionStorage.getItem(STORAGE_KEY);
    const savedIndustry = sessionStorage.getItem(INDUSTRY_KEY);
    const savedFile = sessionStorage.getItem(FILE_KEY);

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setResponse(parsedData);
      } catch (error) {
        console.error("Error parsing saved data:", error);
      }
    }

    if (savedIndustry) {
      setSelectedIndustry(savedIndustry);
    }

    if (savedFile) {
      try {
        const fileData = JSON.parse(savedFile);
        // Create a new File object from the saved data
        if (fileData.name && fileData.content) {
          setFileContent(fileData.content);
          // We can't directly create a File object with the same properties,
          // but we can store enough information to display the filename
          setSelectedFile({
            name: fileData.name,
          });
        }
      } catch (error) {
        console.error("Error parsing saved file data:", error);
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
    "Loan Recovery Agency",
  ];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.name.endsWith(".txt")) {
        setError("Only .txt files are accepted");
        setSelectedFile(null);
        setFileContent(null);
        sessionStorage.removeItem(FILE_KEY);
        return;
      }

      setSelectedFile(file);
      setError(null);

      // Read file content and save to session storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setFileContent(content);

        // Save file info to session storage
        const fileData = {
          name: file.name,
          content: content,
        };
        sessionStorage.setItem(FILE_KEY, JSON.stringify(fileData));
      };
      reader.readAsText(file);
    }
  };

  // Update industry selection and save to session storage
  const handleIndustryChange = (e) => {
    const industry = e.target.value;
    setSelectedIndustry(industry);
    sessionStorage.setItem(INDUSTRY_KEY, industry);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user_id = session.user.id;

    try {
      await axios.post(
        "https://main-server-restless-dawn-7780.fly.dev/accounting_recipe/session_history/",
        {
          file_name: selectedFile.name,
          industry: selectedIndustry,
          response: JSON.stringify(response),
          user_id: user_id,
        }
      );
      setSuccessMessage("Recipe saved successfully");
    } catch (error) {
      setError("Failed to save the recipe: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to export data to Word document
  const handleExportToWord = () => {
    if (!response) {
      setError("No data available to export");
      return;
    }

    // Create a new document with a single bullet point reference
    const doc = new Document({
      numbering: {
        config: [
          {
            reference: "bullet-points",
            levels: [
              {
                level: 0,
                format: "bullet",
                text: "•",
                alignment: "start",
                style: {
                  paragraph: {
                    indent: { left: 720, hanging: 260 },
                  },
                },
              },
            ],
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440,
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
              size: {
                width: 12240,
                height: 15840,
              },
            },
          },
          children: [
            new Paragraph({
              text: `${
                response.business_overview.industry_type || "Business"
              } Accounting Recipe`,
              heading: HeadingLevel.HEADING_1,
            }),

            // Business Overview Section
            new Paragraph({
              text: "Business Overview",
              heading: HeadingLevel.HEADING_2,
            }),

            // Convert business overview to bullet points
            new Paragraph({
              text: `Industry Type: ${
                response.business_overview.industry_type || "N/A"
              }`,
              numbering: {
                reference: "bullet-points",
                level: 0,
              },
            }),
            new Paragraph({
              text: `Name: ${response.business_overview.name || "N/A"}`,
              numbering: {
                reference: "bullet-points",
                level: 0,
              },
            }),
            new Paragraph({
              text: `Type: ${response.business_overview.type || "N/A"}`,
              numbering: {
                reference: "bullet-points",
                level: 0,
              },
            }),
            new Paragraph({
              text: `Sales Regions: ${
                response.business_overview.sales_bifurcation?.join(", ") ||
                "N/A"
              }`,
              numbering: {
                reference: "bullet-points",
                level: 0,
              },
            }),

            // Additional sections with bullet points
            ...createBulletedSection("Capital", response.capital?.points),
            ...createBulletedSection(
              "Cash and Cash Equivalent",
              response.cash_and_cash_equivalent?.points
            ),
            ...createBulletedSection(
              "Duties and Taxes",
              response.duties_and_taxes?.points
            ),
            ...createBulletedSection(
              "Indirect Expenses",
              response.indirect_expenses?.points
            ),
            ...createBulletedSection(
              "Opening Balances",
              response.opening_balances?.points
            ),
            ...createBulletedSection("Purchases", response.purchases?.points),
            ...createBulletedSection("Sales", response.sales?.points),
            ...createBulletedSection(
              "Sales Return",
              response.sales_return?.points
            ),
            ...createBulletedSection(
              "Secured Loans",
              response.secured_loans?.points
            ),
            ...createBulletedSection(
              "Sundry Creditors",
              response.sundry_creditors?.points
            ),
            ...createBulletedSection(
              "Sundry Debtors",
              response.sundry_debtors?.points
            ),
          ],
        },
      ],
    });

    // Generate and save document
    Packer.toBlob(doc)
      .then((blob) => {
        saveAs(
          blob,
          `${
            response.business_overview.industry_type || "Business"
          }_Accounting_Recipe.docx`
        );
        setSuccessMessage("Document exported successfully");
      })
      .catch((error) => {
        setError("Failed to export document: " + error.message);
      });
  };

  // Helper function to create a bulleted section with heading and content
  const createBulletedSection = (title, points) => {
    if (!points || points.length === 0) return [];

    const paragraphs = [
      new Paragraph({
        text: title,
        heading: HeadingLevel.HEADING_2,
      }),
    ];

    // Add bulleted paragraphs for each point
    points.forEach((point) => {
      paragraphs.push(
        new Paragraph({
          text: point,
          numbering: {
            reference: "bullet-points",
            level: 0,
          },
        })
      );
    });

    return paragraphs;
  };

  const handleOpenModal = (data) => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!selectedFile || !selectedIndustry) {
      setError("Please select both an industry and a file");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    setResponse(null);

    try {
      // Create FormData object to send multipart/form-data
      const formData = new FormData();

      // If we have a file from the input, use it directly
      if (selectedFile instanceof File) {
        formData.append("file", selectedFile);
      }
      // If we have a file from session storage, create a new Blob/File
      else if (fileContent && selectedFile.name) {
        const blob = new Blob([fileContent], { type: "text/plain" });
        const file = new File([blob], selectedFile.name, {
          type: "text/plain",
        });
        formData.append("file", file);
      } else {
        throw new Error("Invalid file data");
      }

      formData.append("industry", selectedIndustry);

      const response = await fetch(
        "https://main-server-restless-dawn-7780.fly.dev/accounting_recipe/get-accounting-instruction/",
        {
          method: "POST",
          body: formData,
        }
      );

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
              onChange={handleIndustryChange}
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
            <div className="action-buttons">
              <button
                className="export-button"
                onClick={handleOpenModal}
                disabled={!response}
              >
                <span className="button-icon">📄</span>
                Generate CSV
              </button>
              <button
                className="export-button"
                onClick={handleExportToWord}
                disabled={!response}
              >
                <span className="button-icon">📄</span>
                Export to Word
              </button>
              <button
                className="save-button"
                onClick={handleSave}
                disabled={!response}
              >
                <span className="button-icon">💾</span>
                {isLoading && response ? "Saving..." : "Save Recipe"}
              </button>
            </div>
            <FileUploadModal open={modalOpen} handleClose={handleCloseModal} />
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
