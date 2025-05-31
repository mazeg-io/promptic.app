"use client";

import React, { useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
  ReactFlowProvider,
  useReactFlow,
  NodeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { FlowToolbar } from "./toolbar/FlowToolbar";
import { FlowSidebar } from "./sidebar/FlowSidebar";
import { nodeTypes } from "./nodes/node.types";
import { useNodeHelpers } from "./helpers/useNodeHelpers";
import { useGlobal } from "@/lib/context/GlobalContext";
import { db } from "@/instant";
import { id } from "@instantdb/react";
import { Button } from "../ui/button";

const FlowCanvasInner: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const { addNode, focusNode } = useNodeHelpers({ setNodes });
  const { activeProject } = useGlobal();
  const { data: promptsData } = db.useQuery({
    prompts: {
      $: {
        where: {
          project: activeProject?.id || "",
        },
      },
      metadata: {},
      information: {},
    },
  });

  // Function to update position in database immediately
  const updatePositionInDB = useCallback(
    async (
      nodeId: string,
      position: { x: number; y: number },
      informationId: string
    ) => {
      try {
        await db.transact([
          db.tx.prompt_information[informationId].update({
            positionX: Math.round(position.x),
            positionY: Math.round(position.y),
            updatedAt: Date.now(),
          }),
        ]);
      } catch (error) {
        console.error("Failed to update position:", error);
      }
    },
    []
  );

  // Custom onNodesChange handler to track position changes
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // Process position changes
      changes.forEach((change) => {
        if (change.type === "position" && change.position && !change.dragging) {
          // Position change completed (not dragging anymore)
          const node = nodes.find((n) => n.id === change.id);
          const nodeData = node?.data as any;
          if (nodeData?.information?.id) {
            updatePositionInDB(
              change.id,
              change.position,
              nodeData.information.id
            );
          }
        }
      });

      // Apply changes to React Flow
      onNodesChange(changes);
    },
    [nodes, onNodesChange, updatePositionInDB]
  );

  const handleCreatePrompt = async () => {
    const newPromptId = id();
    const newPromptInformationId = id();
    const newPrompt = await db.transact([
      // Create the prompt and link it to the project
      db.tx.prompts[newPromptId].update({
        name: "New Prompt",
        content: "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }),
      db.tx.prompts[newPromptId].link({ project: activeProject?.id }),
      db.tx.prompt_information[newPromptInformationId].update({
        positionX: Math.floor(Math.random() * 400 + 100),
        promptId: newPromptId,
        positionY: Math.floor(Math.random() * 300 + 100),
        height: 100,
        width: 100,
        isExpanded: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        nodeType: "prompt",
      }),
      db.tx.prompt_information[newPromptInformationId].link({
        prompt: newPromptId,
      }),
    ]);
  };

  useEffect(() => {
    if (promptsData?.prompts) {
      setNodes(
        promptsData.prompts.map((prompt) => ({
          id: prompt.id,
          type: "promptNode",
          position: {
            x: prompt.information?.positionX || 100,
            y: prompt.information?.positionY || 100,
          },
          data: {
            name: prompt.name,
            prompt: prompt.content,
            metadata: prompt.metadata,
            information: prompt.information,
          },
        }))
      );
    }
  }, [promptsData]);

  return (
    <div className="flex h-full w-full">
      <FlowSidebar addNode={addNode} nodes={nodes} focusNode={focusNode} />
      {/* <button onClick={handleCreatePrompt}>handleCreatePrompt</button> */}
      <Button onClick={handleCreatePrompt}>Create Prompt</Button>
      <div className="flex-1 relative">
        <FlowToolbar />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50 dark:bg-gray-900"
        >
          <Background />
          <Controls />
          {/* <MiniMap /> */}
        </ReactFlow>
      </div>
    </div>
  );
};

export const FlowCanvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner />
    </ReactFlowProvider>
  );
};
