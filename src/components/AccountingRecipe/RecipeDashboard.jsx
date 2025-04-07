import React, { useState } from "react";
import AccountingRecipe from "./AccountingRecipe";
import SessionHistory from "./SessionHistory";

const FinancialReports = () => {
  const [activeTab, setActiveTab] = useState("accountingRecipe"); // Default to Profit & Loss

  return (
    <div className="p-4">
      {/* Tabs Container */}
      <div className="flex  mb-6">
        <button
          className={`px-3 py-3 text-sm font-medium mr-4 transition-all duration-300 border-b-2 ${
            activeTab === "accountingRecipe"
              ? "text-brand-500 border-brand-500"
              : "text-gray-500 border-transparent hover:text-brand-500 hover:border-brand-500"
          }`}
          onClick={() => setActiveTab("accountingRecipe")}
        >
          Generate Recipe
        </button>
        <button
          className={`px-3 py-3 text-sm font-medium transition-all duration-300 border-b-2 ${
            activeTab === "balanceSheet"
              ? "text-brand-500 border-brand-500"
              : "text-gray-500 border-transparent hover:text-brand-500 hover:border-brand-500"
          }`}
          onClick={() => setActiveTab("balanceSheet")}
        >
          Previous Receipes
        </button>
      </div>

      {/* Content Container */}
      <div className="transition-all duration-300 ">
        {activeTab === "accountingRecipe" ? (
          <AccountingRecipe />
        ) : (
          <SessionHistory />
        )}
      </div>
    </div>
  );
};

export default FinancialReports;
