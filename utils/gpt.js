import OpenAI from "openai";

export default async (content) => {
  const API_KEY = process.env.OPENAI_API_KEY;

  const client = new OpenAI({
    apiKey: API_KEY,
  });

  const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a professional event planner." },
      { role: "user", content },
    ],
  });

  return completion.choices[0].message.content;
};
