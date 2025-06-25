import { init } from "@instantdb/admin";
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
    const db = init({
      appId: process.env.INSTANTDB_APP_ID || "",
      adminToken: process.env.INSTANTDB_ADMIN_TOKEN || "",
    });

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
    const db = init({
      appId: process.env.INSTANTDB_APP_ID || "",
      adminToken: process.env.INSTANTDB_ADMIN_TOKEN || "",
    });

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
    const db = init({
      appId: process.env.INSTANTDB_APP_ID || "",
      adminToken: process.env.INSTANTDB_ADMIN_TOKEN || "",
    });

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

    // Add debugging
    console.log("Validation query result:", JSON.stringify(result, null, 2));

    if (result.error) {
      return { isValid: false, error: result.error };
    }

    if (!result.prompts || result.prompts.length === 0) {
      return { isValid: false, error: "Prompt not found" };
    }

    const prompt = result.prompts[0];
    console.log("Prompt data:", JSON.stringify(prompt, null, 2));
    console.log("Expected projectKey:", projectKey);
    console.log("Actual project data:", prompt.project);

    // Fix: project is an array, so we need to check the first element's key
    const isValid =
      prompt.project &&
      Array.isArray(prompt.project) &&
      prompt.project.length > 0 &&
      prompt.project[0].key === projectKey;
    console.log("Validation result:", isValid);

    return { isValid };
  } catch (error) {
    console.error("Validation error:", error);
    return { isValid: false, error: (error as Error).message };
  }
}

export async function updatePromptContent(
  promptId: string,
  content: string
): Promise<UpdatePromptResult> {
  try {
    const db = init({
      appId: process.env.INSTANTDB_APP_ID || "",
      adminToken: process.env.INSTANTDB_ADMIN_TOKEN || "",
    });

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
