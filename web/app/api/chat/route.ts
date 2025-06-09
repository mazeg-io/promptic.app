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
          "Call this tool ONLY when the user explicitly asks to write, rewrite, change, update, or modify a prompt. This tool is used to finalize and save the edited prompt. \nRULES:\n1. The 'prompt' parameter MUST contain the entire, complete text of the prompt after all edits, even if only one line was changed.\n2. If the user's request was to 'rewrite' or 'change' the prompt, you MUST NOT return the original text. The new prompt must contain meaningful improvements and tangible changes.",
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
