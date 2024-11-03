// // /pages/api/speech-to-text.js
// export const runtime = "edge";
// import {
//   SpeechConfig,
//   AudioConfig,
//   SpeechRecognizer,
// } from "microsoft-cognitiveservices-speech-sdk";

// export default async function handler(req: { method: string; body: { audioData: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { text?: string; error?: string; message?: string; }): void; new(): any; }; }; }) {
//   if (req.method === "POST") {
//     try {
//       const { audioData } = req.body;

//       // Set up Azure Speech credentials
//       const subscriptionKey = process.env.AZURE_SPEECH_KEY;
//       const region = process.env.AZURE_SPEECH_REGION;

//       if (!subscriptionKey || !region) {
//         throw new Error("Azure Speech credentials are not set in environment variables.");
//       }

//       const speechConfig = SpeechConfig.fromSubscription(
//         subscriptionKey,
//         region
//       );

//       // Convert audio data to speech recognizer input
//       const audioConfig = AudioConfig.fromWavFileInput(
//         Buffer.from(audioData, "base64")
//       );
//       const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

//       // Recognize speech asynchronously
//       recognizer.recognizeOnceAsync(
//         (result) => {
//           if (result.reason === 0) {
//             res.status(200).json({ text: result.text });
//           } else {
//             res.status(500).json({ error: "Speech recognition failed" });
//           }
//         },
//         (err) => {
//           console.error(err);
//           res.status(500).json({ error: "Error during recognition" });
//         }
//       );
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Error processing the audio" });
//     }
//   } else {
//     res.status(405).json({ message: "Method Not Allowed" });
//   }
// }
