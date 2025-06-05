import express, { Request, Response } from "express";
import cors from "cors";
import { init } from "@instantdb/admin";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

interface PromptRequest {
  promptKey: string;
  projectKey: string;
}

interface PromptResult {
  prompts?: Array<{ content: string; variables: string }>;
  error?: string;
}

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.post(
  "/api/prompt",
  async (req: Request<{}, {}, PromptRequest>, res: Response) => {
    const { promptKey, projectKey } = req.body;

    if (!promptKey || typeof promptKey !== "string") {
      return res.status(400).json({ error: "Missing or invalid 'promptKey'" });
    }

    try {
      const result = await getPromptFromInstant(promptKey, projectKey);

      if (result.error) {
        return res.status(500).json({ error: result.error });
      }

      if (!result.prompts || result.prompts.length === 0) {
        return res.status(404).json({ error: "Prompt not found" });
      }

      return res.status(200).json({
        prompt: result.prompts[0].content,
        variables: result.prompts[0].variables,
      });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

async function getPromptFromInstant(
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

export default app;
