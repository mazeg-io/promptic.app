import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import z from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    tools: {
      prompt_write: tool({
        description:
          "Call this tool when user ask to rewrite or write a prompt. If user ask to rewrite part of the prompt, you still should return the whole prompt but with the updated part.",
        parameters: z.object({
          prompt: z.string().describe("writed or updated prompt."),
        }),
        execute: async ({ prompt }) => {
          return {
            prompt,
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
