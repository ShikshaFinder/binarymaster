// pages/api/getanswer.ts
import { AzureOpenAI } from "openai";
import dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";

dotenv.config();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Set environment variables or hardcoded values
    const endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
    const apiKey = process.env["AZURE_OPENAI_API_KEY"];
    const apiVersion = "2024-05-01-preview";
    const deployment = "talkwithdoc"; // This must match your deployment name

    // Initialize AzureOpenAI client with API key-based authentication
    const client = new AzureOpenAI({
      endpoint,
      apiKey,
      apiVersion,
      deployment,
    });

    // Prepare the chat completion request
    const result = await client.chat.completions.create({
      model: deployment,
      messages: [
        {
          role: "system",
          content:
            "You are a guide for Binary Master.Tech. You are helping a user to know more about binary master.tech and its services.They provide cost effective solutions related with IT & AI . They are at their work, the company is registered under startup India . Binary Master is a great source of knowledge and learning. They are providing services like web development, app development, digital marketing, AI, ML, and many more . We aim to create diffrent kind of products which solves problems of our clients and we belive in Faster delivery bybuilding MVP and if we get enough time we build scalable products, Binary Master is created by founder and CEO of shiksha finder,Harsh Jani",
        },
        {
          role: "user",
          content: req.body,
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: null,
    });

    // Send the response back as JSON
    const messages = result.choices.map((choice) => choice.message);
    res.status(200).json({ messages });
  } catch (err) {
    console.error("The API encountered an error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
