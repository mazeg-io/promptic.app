import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import z from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: openai("gpt-4o"),
    messages: [
      {
        role: "system",
        content: "Your name is Promptic AI",
      },
      ...messages,
    ],
    tools: {
      prompt_write: tool({
        description:
          "Call this tool when user ask to rewrite or write a prompt",
        parameters: z.object({
          prompt: z.string().describe("writed or updated prompt"),
        }),
        execute: async ({ prompt }) => {
          console.log("prompt_write", prompt);
          return {
            prompt,
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
