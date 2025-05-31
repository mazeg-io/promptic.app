import { useCallback } from "react";
import { Node, useReactFlow } from "@xyflow/react";

export const useNodeHelpers = ({
  setNodes,
}: {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}) => {
  const { fitView } = useReactFlow();

  const focusNode = useCallback(
    (nodeId: string) => {
      fitView({
        nodes: [{ id: nodeId }],
        duration: 800,
        padding: 0.1,
      });
    },
    [fitView]
  );

  const addNode = useCallback(
    (nodeType: string) => {
      // Calculate a position for the new node (center of viewport with some offset)
      const position = {
        x: Math.random() * 400 + 100, // Random position to avoid overlap
        y: Math.random() * 300 + 100,
      };

      const newNodeId = `${nodeType}-${Date.now()}`;
      const newNode: Node = {
        id: newNodeId,
        type: nodeType,
        position,
        data: {
          label: `${nodeType} node`,
          prompt: "",
        },
      };

      setNodes((nds) => nds.concat(newNode));

      // Focus on the newly created node after a short delay to ensure it's rendered
      setTimeout(() => {
        focusNode(newNodeId);
      }, 100);
    },
    [setNodes, focusNode]
  );

  return { addNode, focusNode };
};
