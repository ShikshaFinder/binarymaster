"use client";
import React, { useState } from "react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export function PlaceholdersAndVanishInputDemo() {
  const placeholders = [
    "Can I build a website without any hustle ?",
    "Is Binary Master.Tech costly ?",
    "What is MVP ?",
    "In how much time can I get my website ?",
    "How AI can impact my business ?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
 
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
   const [inputText, setInputText] = useState("");
   const [summary, setSummary] = useState("");
   const [loading, setLoading] = useState(false);
  return (
    <div className="h-[40rem] flex flex-col justify-center  items-center px-4">
      <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
        Ask Us Anything !
      </h2>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Summarizing..." : "Summarize"}
      </button>
      <TextGenerateEffect words={summary} />
    </div>
  );
}
