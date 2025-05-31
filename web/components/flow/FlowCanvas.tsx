"use client";

import React, { useCallback, useEffect } from "react";
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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { FlowToolbar } from "./toolbar/FlowToolbar";
import { FlowSidebar } from "./sidebar/FlowSidebar";
import { nodeTypes } from "./nodes/node.types";
import { useNodeHelpers } from "./helpers/useNodeHelpers";
import { useGlobal } from "@/lib/context/GlobalContext";
import { db } from "@/instant";
import { id } from "@instantdb/react";

const FlowCanvasInner: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    console.log("nodes", nodes);
  }, [nodes]);

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

  const handleCreatePrompt = async () => {
    const newPromptId = id();
    const newPromptInformationId = id();

    const newPrompt = await db.transact([
      // Create the prompt and link it to the project
      db.tx.prompts[newPromptId].update({
        name: "New Prompt",
        content: "New Prompt Content 123 123 123",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }),
      db.tx.prompts[newPromptId].link({ project: activeProject?.id }),
      db.tx.prompt_information[newPromptInformationId].update({
        positionX: 100,
        promptId: newPromptId,
        positionY: 100,
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
            prompt: prompt.content,
            label: prompt.name,
            metadata: prompt.metadata,
            information: prompt.information,
          },
        }))
      );
    }
  }, [promptsData]);

  useEffect(() => {
    console.log("nodes", nodes);
  }, [nodes]);

  return (
    <div className="flex h-full w-full">
      <FlowSidebar addNode={addNode} nodes={nodes} focusNode={focusNode} />
      {/* <button onClick={handleCreatePrompt}>handleCreatePrompt</button> */}
      <div className="flex-1 relative">
        <FlowToolbar />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
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
