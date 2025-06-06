import { PromptNode } from "./PromptNode";
import { EmptyStateNode } from "./EmptyStateNode";

export const nodeTypes = {
  promptNode: PromptNode,
  emptyStateNode: EmptyStateNode,
};

export type NodeType = keyof typeof nodeTypes;

export { PromptNode, EmptyStateNode };
