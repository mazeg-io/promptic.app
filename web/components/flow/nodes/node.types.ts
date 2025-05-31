import { PromptNode } from "./PromptNode";

export const nodeTypes = {
  promptNode: PromptNode,
};

export type NodeType = keyof typeof nodeTypes;

export { PromptNode };
