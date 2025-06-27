import { db } from "../lib/instantdb";
import logger from "../lib/logger";
import {
  PromptRequest,
  PromptResult,
  ProjectPromptsResult,
  PromptProjectValidationResult,
  UpdatePromptRequest,
  UpdatePromptResult,
} from "../types";

export async function getPromptFromInstant(
  promptName: string,
  projectKey: string
): Promise<PromptResult> {
  try {
    return (await db.query({
      prompts: {
        $: {
          where: {
            and: [{ name: promptName }, { "project.key": projectKey }],
          },
        },
      },
    })) as unknown as PromptResult;
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function getProjectPromptsFromInstant(
  projectKey: string
): Promise<ProjectPromptsResult> {
  try {
    return (await db.query({
      projects: {
        $: {
          where: {
            and: [{ key: projectKey }],
          },
        },
        prompts: {},
      },
    })) as unknown as ProjectPromptsResult;
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function validatePromptInProject(
  promptId: string,
  projectKey: string
): Promise<{ isValid: boolean; error?: string }> {
  try {
    const result = (await db.query({
      prompts: {
        $: {
          where: {
            and: [{ id: promptId }],
          },
        },
        project: {},
      },
    })) as unknown as PromptProjectValidationResult;

    if (result.error) {
      return { isValid: false, error: result.error };
    }

    if (!result.prompts || result.prompts.length === 0) {
      return { isValid: false, error: "Prompt not found" };
    }

    const prompt = result.prompts[0];

    // Fix: project is an array, so we need to check the first element's key
    const isValid =
      prompt.project &&
      Array.isArray(prompt.project) &&
      prompt.project.length > 0 &&
      prompt.project[0].key === projectKey;

    return { isValid };
  } catch (error) {
    logger.error("Validation error:", error);
    return { isValid: false, error: (error as Error).message };
  }
}

export async function updatePromptContent(
  promptId: string,
  content: string
): Promise<UpdatePromptResult> {
  try {
    await db.transact([
      db.tx.prompts[promptId].update({
        content: content,
        liveContent: content,
        variables: extractVariables(content),
        updatedAt: Date.now(),
      }),
    ]);

    return { prompts: [{ id: promptId, content: content }] };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

const extractVariables = (prompt: string) => {
  const variables = prompt.match(/{{.*?}}/g);
  const extractedVars = variables
    ?.map((variable) => variable.replace(/{{|}}/g, "").trim())
    .filter((variable) => variable.length > 0)
    .join(", ");
  return extractedVars || "";
};
