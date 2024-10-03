import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // Adjust the import path as needed

const useCompanyData = (maxRetries = 3, retryDelay = 2000) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  const fetchWithRetry = async (retryCount = 0) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session && session.user) {
        const email = session.user.email;
        setUserEmail(email);
      } else {
        throw new Error("User session is not valid. Please log in again.");
      }
    } catch (error) {
      console.error(
        `Error fetching company data (attempt ${retryCount + 1}):`,
        error
      );

      if (retryCount < maxRetries) {
        console.log(`Retrying in ${retryDelay}ms...`);
        setTimeout(() => fetchWithRetry(retryCount + 1), retryDelay);
      } else {
        setError("Failed to fetch company data after multiple attempts");
      }
    }
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      await fetchWithRetry();
      setLoading(false);
    };

    fetchCompanies();
  }, []);

  return { userEmail, error, loading };
};

export default useCompanyData;
