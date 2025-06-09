export interface IProject {
  id: string;
  name: string;
  llm_provider?: string;
  provider_key?: string;
  key: string;
  createdAt: number;
  updatedAt: number;
}
