export interface PromptRequest {
  promptKey: string;
  projectKey: string;
}

export interface PromptResult {
  prompts?: Array<{ content: string; variables: string }>;
  error?: string;
}

export interface ProjectPromptsResult {
  projects?: Array<{
    id: string;
    name: string;
    key: string;
    prompts: Array<{
      id: string;
      name: string;
      content: string;
      variables?: string;
      createdAt: number;
      updatedAt: number;
    }>;
  }>;
  error?: string;
}

export interface UpdatePromptRequest {
  projectKey: string;
  promptId: string;
  content: string;
}

export interface UpdatePromptResult {
  prompts?: Array<{
    id: string;
    content: string;
  }>;
  error?: string;
}

export interface PromptProjectValidationResult {
  prompts?: Array<{
    id: string;
    project: Array<{
      id: string;
      key: string;
    }>;
  }>;
  error?: string;
}
