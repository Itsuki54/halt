import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { gender, purpose, character } = req.body;
    if (typeof gender !== "string" || typeof purpose !== "string" || typeof character !== "string") {
      return res.status(400).json({ error: "All fields must be strings" });
    }

    const response = await openai.images.generate({
      prompt: `${gender} ${purpose} ${character}`,
      model: "dall-e-3",
      n: 1,
      size: "1024x1024",
    });

    const imagePath = response.data[0].url;
    if (!imagePath) {
      throw new Error("Image path not found in response");
    }

    res.status(200).json({ imagePath });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
