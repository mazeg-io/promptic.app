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
import { id } from "@instantdb/react";
import { Button } from "../ui/button";
import { CustomCursor } from "./CustomCursor";
import { usePresence } from "./hooks/usePresence";
import LiveComment from "./LiveComment";

const FlowCanvasInner: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [isLiveCommenting, setIsLiveCommenting] = useState(false);
  const [liveCommentText, setLiveCommentText] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { handleCreatePromptNode, focusNode, handleNodesChange } =
    useNodeHelpers({ setNodes, nodes, onNodesChange });
  const { activeProject, profile } = useGlobal();

  // Create a room for the current project, with fallback to prevent null
  const room = activeProject
    ? db.room("project-canvas", activeProject.id)
    : db.room("project-canvas", `default-room-${crypto.randomUUID()}`);

  // Use the presence hook
  const { peers, stableUserColor, isReady } = usePresence({
    room,
    liveCommentText,
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
            variables: prompt.variables,
            metadata: prompt.metadata,
            information: prompt.information,
          },
        }))
      );
    }
  }, [promptsData]);

  // Don't render until profile is loaded
  if (!profile) {
    return;
  }

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
            <div className="relative h-full w-full" ref={reactFlowWrapper}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={handleNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                className="bg-gray-50 dark:bg-gray-900"
                panOnDrag={false}
                panActivationKeyCode="Space"
                panOnScroll={true}
                zoomOnScroll={false}
                zoomActivationKeyCode="Meta"
              >
                <Background />
                <Controls />
              </ReactFlow>

              {isReady && (
                <CustomCursor
                  peers={peers}
                  reactFlowWrapper={reactFlowWrapper}
                  stableUserColor={stableUserColor}
                />
              )}

              {/* Live commenting cursor follower */}
              <LiveComment
                mousePosition={mousePosition}
                setIsLiveCommenting={setIsLiveCommenting}
                setMousePosition={setMousePosition}
                isLiveCommenting={isLiveCommenting}
                liveCommentText={liveCommentText}
                setLiveCommentText={setLiveCommentText}
              />
            </div>
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
