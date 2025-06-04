import axios, { AxiosInstance } from "axios";

export interface PrompticClientConfig {
  baseUrl: string;
}

export interface Prompt {
  prompt: string;

  variables: string;

  format(values: Record<string, string>): string;
}

export class PrompticClient {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(config: PrompticClientConfig) {
    this.baseUrl = config.baseUrl;
    this.client = axios.create({
      baseURL: this.baseUrl,
    });
  }

  getPrompt(promptKey: string): Promise<Prompt> & {
    format: (values: Record<string, string>) => Promise<string>;
  } {
    const fetchPromise = this.fetchPrompt(promptKey);

    const enhancedPromise = fetchPromise as Promise<Prompt> & {
      format: (values: Record<string, string>) => Promise<string>;
    };

    enhancedPromise.format = (values: Record<string, string>) => {
      return fetchPromise.then((prompt) => prompt.format(values));
    };

    return enhancedPromise;
  }

  private async fetchPrompt(promptKey: string): Promise<Prompt> {
    try {
      const response = await this.client.post("/api/prompt", {
        promptKey,
      });

      const promptData = response.data;

      const promptResponseData: Prompt = {
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

      return promptResponseData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to get prompt: ${error}`);
      }
      throw error;
    }
  }
}

export default PrompticClient;
