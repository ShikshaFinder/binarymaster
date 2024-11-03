// pages/summarize.tsx

import { useState } from "react";


export default function Summarize() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setSummary(""); // Clear any previous summary

    try {
      // Send the user's input text to the API route
      const response = await fetch("/api/getanswer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputText), // Send input text as JSON
      });

      const data = await response.json();

      if (response.ok) {
        setSummary(data.messages[0]?.content || "No summary found.");
      } else {
        console.error("Failed to get summary:", data.error);
        setSummary("Error fetching summary.");
      }
    } catch (error) {
      console.error("Error during request:", error);
      setSummary("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto p-5">
      <div className=" flex flex-col   items-center px-4">
      <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
        Know About Binary Master
      </h2>
          </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="inputText" className="block text-sm font-medium text-gray-700 mb-2">
          Know More About binary master
        </label>
        <input
          id="inputText"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Genrating..." : "Know"}
        </button>
      </form>
      {summary && (
        <div className="mt-6 p-4 border border-gray-300 rounded-md bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
