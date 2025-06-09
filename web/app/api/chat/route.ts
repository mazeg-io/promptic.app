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
          "TRIGGER: Activate this tool when user intent matches ANY of these patterns:\n" +
          "- Creation: write, create, compose, draft, generate, craft, make, build, develop, design\n" +
          "- Modification: rewrite, revise, edit, modify, update, change, transform, adjust, enhance, refine\n" +
          "- Improvement: improve, optimize, polish, perfect, enhance\n\n" +
          "PURPOSE: Finalize and persist prompt modifications or creations in the system.\n\n" +
          "RULES:\n" +
          "1. COMPLETENESS: The 'prompt' parameter MUST contain the complete, final version of the prompt, regardless of modification scope.\n" +
          "2. IMPROVEMENT: For modification requests, the new prompt MUST demonstrate:\n" +
          "   - Clear structural improvements\n" +
          "   - Enhanced clarity and precision\n" +
          "   - Better organization or flow\n" +
          "   - More effective language or tone\n" +
          "3. VALIDATION: Ensure the modified prompt:\n" +
          "   - Maintains original intent\n" +
          "   - Is grammatically correct\n" +
          "   - Has no redundant content\n" +
          "   - Is properly formatted\n" +
          "4. CREATION: For new prompt creation requests:\n" +
          "   - Generate a complete, well-structured prompt\n" +
          "   - Include all necessary sections and components\n" +
          "   - Follow best practices for prompt engineering\n" +
          "   - Ensure the prompt is ready for immediate use\n" +
          "5. TOOL TRIGGERING:\n" +
          "   - MUST call this tool for ANY creation request (create, make, generate, write, etc.)\n" +
          "   - MUST call this tool for ANY modification request (edit, update, change, etc.)\n" +
          "   - MUST call this tool for ANY improvement request (enhance, optimize, etc.)\n" +
          "   - MUST provide the complete prompt in the 'prompt' parameter\n" +
          "   - MUST NOT return the original prompt for any modification request\n" +
          "   - MUST ensure the prompt is properly formatted with newlines",
        parameters: z.object({
          prompt: z.string().describe("writed or updated prompt."),
        }),
        execute: async ({ prompt }) => {
          console.log("prompt", prompt);
          return {
            prompt,
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
