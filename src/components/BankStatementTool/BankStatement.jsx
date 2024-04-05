import React, { useState, useEffect } from "react";
import FileUpload from "./FileUpload";
import "./BankStatement.css";

const BankStatement = () => {
  const [selectedBank, setSelectedBank] = useState("");
  const [inputFields, setInputFields] = useState([]);

  useEffect(() => {
    // Fetch and check if conversion is manual or automatic based on selectedBank
  }, [selectedBank]);

  return (
    <div className="bankstatement-container">
      <div
        className="fileupload"
        style={
          {
            // border: "1px solid #808080",
          }
        }
      >
        <FileUpload inputFields={inputFields} />
      </div>
    </div>
  );
};
export default BankStatement;
