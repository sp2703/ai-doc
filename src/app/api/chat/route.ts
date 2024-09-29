import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateText, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createOpenAI as createGroq } from "@ai-sdk/openai";

const groq = createGroq({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

const generationConfig = {
  stopSequences: ["red"],
  maxOutputTokens: 500,
  temperature: 0.7,
  topP: 0.6,
  topK: 16,
};

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig,
});

export async function POST(request: NextRequest) {
  const { messages } = await request.json();
  const prompt = messages[messages.length - 1].content;
  const instruction = `I want to know the medical advice you would give for the following query:`;
  // "I want you to find three paramters from the given prmopt, name of the cricker, venue of the innings played and the date of the innings played, I want you to make the judgement about what innings is being talked about and then give the result at any cost the prompt is:";
  const result = await streamText({
    model: groq("gemma2-9b-it"),
    prompt: `${instruction}+${prompt}`,
  });

  // console.log("texttff", text);
  // const result = await model.generateContent(`${instruction} ${prompt}`);
  // console.log(`${instruction}+${prompt}`, "resulh", result.response.text());
  // const responseText = result.response.text(); // `result.text()` is asynchronous

  // Return the text in a JSON response
  return result.toDataStreamResponse();
  // return NextResponse.json({ response: responseText }, { status: 200 });
}
