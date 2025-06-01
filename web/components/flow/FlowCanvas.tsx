"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useState,
} from "react";
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
import { id, Cursors } from "@instantdb/react";
import { Button } from "../ui/button";
import { CustomCursor } from "./CustomCursor";

const randomDarkColor =
  "#" +
  [0, 0, 0]
    .map(() =>
      Math.floor(Math.random() * 200)
        .toString(16)
        .padStart(2, "0")
    )
    .join("");

const FlowCanvasInner: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const { handleCreatePromptNode, focusNode, handleNodesChange } =
    useNodeHelpers({ setNodes, nodes, onNodesChange });
  const { activeProject, profile } = useGlobal();

  // Create a room for the current project, with fallback to prevent null
  const room = activeProject
    ? db.room("project-canvas", activeProject.id)
    : db.room("project-canvas", `default-room-${crypto.randomUUID()}`);

  // Add user name into cursors
  db.rooms.useSyncPresence(room, {
    name: profile?.firstName || "Anonymous",
  });

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

  // Add prompt nodes to the canvas based on updates from the database
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
      <FlowSidebar
        handleCreatePromptNode={handleCreatePromptNode}
        nodes={nodes}
        focusNode={focusNode}
      />
      <div className="flex-1 relative">
        {room && (
          <>
            <FlowToolbar room={room} />
            <Cursors
              room={room}
              className="h-full w-full"
              userCursorColor={randomDarkColor}
              spaceId="flow-canvas"
              renderCursor={(props) => (
                <CustomCursor color={props.color} name={props.presence.name} />
              )}
            >
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
              </ReactFlow>
            </Cursors>
          </>
        )}
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
