import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  getProjectPromptsFromInstant,
  getPromptFromInstant,
  validatePromptInProject,
  updatePromptContent,
} from "./services/instant";
import { PromptRequest, UpdatePromptRequest } from "./types";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.get(
  "/api/projectPrompts/:projectKey",
  async (req: Request, res: Response) => {
    const { projectKey } = req.params;

    if (!projectKey || typeof projectKey !== "string") {
      return res.status(400).json({ error: "Missing or invalid 'projectKey'" });
    }

    try {
      const result = await getProjectPromptsFromInstant(projectKey);

      if (result.error) {
        return res.status(500).json({ error: result.error });
      }

      if (!result.projects || result.projects.length === 0) {
        return res.status(404).json({ error: "Project not found" });
      }

      const project = result.projects[0];
      return res.status(200).json({
        projectId: project.id,
        projectName: project.name,
        projectKey: project.key,
        prompts: project.prompts.map((prompt) => ({
          id: prompt.id,
          name: prompt.name,
          content: prompt.content,
          variables: prompt.variables,
          createdAt: prompt.createdAt,
          updatedAt: prompt.updatedAt,
        })),
      });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

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

app.put(
  "/api/updatePrompt",
  async (req: Request<{}, {}, UpdatePromptRequest>, res: Response) => {
    const { projectKey, promptId, content } = req.body;

    // Validate required fields
    if (!projectKey || typeof projectKey !== "string") {
      return res.status(400).json({ error: "Missing or invalid 'projectKey'" });
    }

    if (!promptId || typeof promptId !== "string") {
      return res.status(400).json({ error: "Missing or invalid 'promptId'" });
    }

    if (!content || typeof content !== "string") {
      return res.status(400).json({ error: "Missing or invalid 'content'" });
    }

    try {
      // Efficiently verify that the prompt belongs to the specified project
      const validation = await validatePromptInProject(promptId, projectKey);

      if (validation.error) {
        if (validation.error === "Prompt not found") {
          return res.status(404).json({ error: "Prompt not found" });
        }
        return res.status(500).json({ error: validation.error });
      }

      if (!validation.isValid) {
        return res.status(403).json({
          error: "Prompt does not belong to the specified project",
        });
      }

      // Update the prompt content
      const updateResult = await updatePromptContent(promptId, content);

      if (updateResult.error) {
        return res.status(500).json({ error: updateResult.error });
      }

      return res.status(200).json({
        message: "Prompt updated successfully",
        promptId: promptId,
        updatedContent: content,
      });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);
