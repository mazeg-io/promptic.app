import axios, { AxiosInstance } from "axios";
import NodeCache from "node-cache";

export interface PrompticClientConfig {
  baseUrl: string;
  projectKey: string;
}

export interface Prompt {
  prompt: string;

  variables: string;

  format(values: Record<string, string>): string;
}

export class PrompticClient {
  private client: AxiosInstance;
  private baseUrl: string;
  private projectKey: string;
  private promptCache: NodeCache;
  private refreshInterval: NodeJS.Timeout | null = null;
  private cacheRefreshIntervalMs: number;

  constructor(config: PrompticClientConfig) {
    this.baseUrl = config.baseUrl;
    this.projectKey = config.projectKey;
    this.cacheRefreshIntervalMs = 30000;
    this.client = axios.create({
      baseURL: this.baseUrl,
    });

    this.promptCache = new NodeCache({
      stdTTL: 3600,
      checkperiod: 120,
      useClones: false,
    });

    this.startCacheRefresh();
  }

  private startCacheRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    this.refreshInterval = setInterval(async () => {
      const keys = this.promptCache.keys();
      for (const promptKey of keys) {
        try {
          await this.refreshCachedPrompt(promptKey, this.projectKey);
        } catch (error) {
          console.error(`Failed to refresh cached prompt ${promptKey}:`, error);
        }
      }
    }, this.cacheRefreshIntervalMs);
  }

  private async refreshCachedPrompt(promptKey: string, projectKey: string): Promise<void> {
    try {
      const response = await this.client.post("/api/prompt", {
        promptKey,
        projectKey
      });

      const promptData = response.data;
      const newPrompt = this.createPromptObject(promptData);

      const currentPrompt = this.promptCache.get<Prompt>(promptKey);
      if (
        !currentPrompt ||
        JSON.stringify(currentPrompt.prompt) !==
          JSON.stringify(newPrompt.prompt)
      ) {
        this.promptCache.set(promptKey, newPrompt);
      }
    } catch (error) {
      throw error;
    }
  }

  private createPromptObject(promptData: any): Prompt {
    return {
      prompt: promptData.prompt,
      variables: promptData.variables,
      format(values: Record<string, string>): string {
        let formattedPrompt = this.prompt;

        const requiredVariables = this.variables
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);

        const missingVariables = requiredVariables.filter(
          (varName) => !(varName in values)
        );

        if (missingVariables.length > 0) {
          throw new Error(
            `Missing required variables: ${missingVariables.join(
              ", "
            )}. All required variables: ${requiredVariables.join(", ")}`
          );
        }

        Object.entries(values).forEach(([key, value]) => {
          const placeholder = `{{${key}}}`;
          formattedPrompt = formattedPrompt.replace(
            new RegExp(placeholder, "g"),
            value
          );
        });

        return formattedPrompt;
      },
    };
  }

  getPrompt(promptKey: string): Promise<Prompt> & {
    format: (values: Record<string, string>) => Promise<string>;
  } {
    const fetchPromise = this.fetchPrompt(promptKey, this.projectKey);

    const enhancedPromise = fetchPromise as Promise<Prompt> & {
      format: (values: Record<string, string>) => Promise<string>;
    };

    enhancedPromise.format = (values: Record<string, string>) => {
      return fetchPromise.then((prompt) => prompt.format(values));
    };

    return enhancedPromise;
  }

  private async fetchPrompt(promptKey: string, projectKey: string): Promise<Prompt> {
    try {
      const cachedPrompt = this.promptCache.get<Prompt>(promptKey);
      if (cachedPrompt) {
        return cachedPrompt;
      }

      const response = await this.client.post("/api/prompt", {
        promptKey,
        projectKey
      });

      const promptData = response.data;
      const prompt = this.createPromptObject(promptData);

      this.promptCache.set(promptKey, prompt);

      return prompt;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to get prompt: ${error}`);
      }
      throw error;
    }
  }

  public dispose(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    this.promptCache.flushAll();
    this.promptCache.close();
  }
}

export default PrompticClient;
