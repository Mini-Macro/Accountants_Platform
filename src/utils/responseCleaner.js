// Function to parse response data with markdown code blocks
export const parseResponseData = (data) => {
  try {
    if (typeof data === "string") {
      // Remove the markdown code block markers if they exist
      const jsonString = data
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      return JSON.parse(jsonString);
    } else if (Array.isArray(data)) {
      // If the data is already an array, use it directly
      return data;
    }
    return []; // Return empty array as fallback
  } catch (parseError) {
    console.error("Error parsing data:", parseError);
    throw new Error("Failed to parse the response data.");
  }
};
