"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  Node,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { LeftToolbar } from "./toolbar/LeftToolbar";
import { nodeTypes } from "./nodes/node.types";
import { useNodeHelpers } from "./helpers/useNodeHelpers";
import { useGlobal } from "@/lib/context/GlobalContext";
import { db } from "@/instant";
import { CustomCursor } from "./CustomCursor";
import { usePresence } from "./helpers/usePresence";
import LiveComment from "./LiveComment";
import { FullScreenPromptEditor } from "../promptEditor/FullScreenPromptEditor";
import BottomMenu from "./bottomMenu/BottomMenu";
import { RightToolbar } from "./toolbar/RightToolbar";

export interface EditingPrompt {
  id: string;
  name: string;
  prompt: string;
  animationOrigin?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

const FlowCanvasInner: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [isLiveCommenting, setIsLiveCommenting] = useState(false);
  const [liveCommentText, setLiveCommentText] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [editingPrompt, setEditingPrompt] = useState<EditingPrompt | null>(
    null
  );
  const [interactionMode, setInteractionMode] = useState<"pointer" | "hand">(
    "pointer"
  );
  const { handleCreatePromptNode, handleNodesChange } = useNodeHelpers({
    setNodes,
    nodes,
    onNodesChange,
  });
  const { activeProject, profile } = useGlobal();

  // Create a room for the current project, with fallback to prevent null
  const room = activeProject
    ? db.room("project-canvas", activeProject.id)
    : db.room("project-canvas", `default-room-${crypto.randomUUID()}`);

  // Use the presence hook
  const { peers, stableUserColor, isReady, myPresence, publishPresence } =
    usePresence({
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
      // If there are prompts, show them
      if (promptsData.prompts.length > 0) {
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
              setEditingPrompt: setEditingPrompt,
              room: room,
            },
          }))
        );
      } else {
        // If no prompts, show empty state node
        setNodes([
          {
            id: "empty-state",
            type: "emptyStateNode",
            position: { x: 100, y: 100 },
            data: {},
            draggable: false,
            selectable: false,
            deletable: false,
          },
        ]);
      }
    }
  }, [promptsData, setNodes]);

  // Don't render until profile is loaded
  if (!profile) {
    return;
  }

  return (
    <div className="flex h-full w-full">
      {editingPrompt && (
        <FullScreenPromptEditor
          isOpen={!!editingPrompt}
          onClose={() => {
            publishPresence({
              name: myPresence.name,
              lastName: myPresence.lastName,
              profilePicture: myPresence.profilePicture || undefined,
              color: myPresence.color,
              flowX: myPresence.flowX,
              flowY: myPresence.flowY,
              screenX: myPresence.screenX,
              screenY: myPresence.screenY,
              liveCommentText: liveCommentText,
              promptId: null,
              userId: profile?.userId, // Add userId for deduplication
            });
            setEditingPrompt(null);
          }}
          prompt={editingPrompt}
        />
      )}
      <div className="flex-1 relative">
        {room && (
          <>
            <LeftToolbar />
            <RightToolbar room={room} />
            <BottomMenu
              room={room}
              interactionMode={interactionMode}
              setInteractionMode={setInteractionMode}
              handleCreatePromptNode={handleCreatePromptNode}
            />
            <div className="relative h-full w-full" ref={reactFlowWrapper}>
              <ReactFlow
                nodes={nodes}
                onNodesChange={handleNodesChange}
                nodeTypes={nodeTypes}
                fitView
                className="bg-gray-50 dark:bg-gray-900"
                panOnDrag={interactionMode === "hand"}
                panActivationKeyCode="Space"
                panOnScroll={true}
                preventScrolling={false}
                onDelete={async (deleteCompononets) => {
                  for (const node of deleteCompononets.nodes) {
                    await db.transact([db.tx.prompts[node.id].delete()]);
                  }
                }}
                zoomActivationKeyCode="Meta"
                nodesDraggable={interactionMode === "pointer"}
                nodesConnectable={interactionMode === "pointer"}
                elementsSelectable={interactionMode === "pointer"}
              >
                <Background />
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
