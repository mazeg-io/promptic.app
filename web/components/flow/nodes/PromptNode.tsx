"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { NodeProps } from "@xyflow/react";
import { Sparkles, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { db } from "@/instant";
import { EditingPrompt } from "../FlowCanvas";

export interface PromptNodeData extends Record<string, unknown> {
  name: string;
  prompt: string;
  variables: string;
  isExpanded?: boolean;
  version?: number;
  tags?: string[];
  setEditingPrompt?: React.Dispatch<React.SetStateAction<EditingPrompt | null>>;
  updateNode?: (nodeId: string, newData: Partial<PromptNodeData>) => void;
  information?: {
    id: string;
    positionX: number;
    positionY: number;
    height: number;
    width: number;
    isExpanded: boolean;
    nodeType: string;
  };
  room: any;
}

type PromptNodeProps = NodeProps & {
  data: PromptNodeData;
};

export const PromptNode: React.FC<PromptNodeProps> = ({
  data,
  id,
  selected,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [prompt, setPrompt] = useState(data.prompt);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const {
    user: myPresence,
    peers,
    publishPresence,
  } = data?.room?.usePresence({});

  // Filter peers who have the same promptId as this node
  const peersOnThisPrompt = React.useMemo(() => {
    if (!peers) return [];

    // Handle if peers is an object with values being the peer data
    if (typeof peers === "object" && !Array.isArray(peers)) {
      return Object.values(peers).filter((peer: any) => peer?.promptId === id);
    }

    // Handle if peers is already an array
    if (Array.isArray(peers)) {
      return peers.filter((peer: any) => peer?.promptId === id);
    }

    return [];
  }, [peers, id]);

  // Update local prompt when data.prompt changes
  useEffect(() => {
    setPrompt(data.prompt);
  }, [data.prompt]);

  const extractVariables = useCallback((prompt: string) => {
    const variables = prompt.match(/{{.*?}}/g);
    return variables
      ?.map((variable) => variable.replace(/{{|}}/g, ""))
      .join(", ");
  }, []);

  // Function to update the database and node
  const updatePromptInDB = useCallback(
    async (newContent?: string, newName?: string) => {
      if (!id) return;

      const updates: Record<string, unknown> = {};
      if (newContent != null) {
        updates.content = newContent;
      }
      if (
        newName !== undefined &&
        newName !== data.name &&
        newName.trim() !== ""
      ) {
        updates.name = newName;
      }

      if (Object.keys(updates).length === 0) return;

      try {
        setIsSaving(true);
        await db.transact([
          db.tx.prompts[id].update({
            ...updates,
            variables: extractVariables(newContent || ""),
            updatedAt: Date.now(),
          }),
        ]);

        // Update the node data directly
        if (data.updateNode) {
          data.updateNode(id, {
            prompt: newContent || data.prompt,
            name: newName || data.name,
            variables: extractVariables(newContent || ""),
          });
        }
      } catch (error) {
        console.error("Failed to update prompt:", error);
      } finally {
        setIsSaving(false);
      }
    },
    [id, data, extractVariables]
  );

  // Handle prompt content changes with debouncing
  const handlePromptChange = useCallback(
    (newContent: string) => {
      // Update local state immediately
      setPrompt(newContent);

      // Clear any existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set a new timeout for database update
      debounceTimeoutRef.current = setTimeout(() => {
        updatePromptInDB(newContent);
      }, 500); // 500ms debounce
    },
    [updatePromptInDB]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Handle name changes
  const handleNameBlur = useCallback(() => {
    if (nameRef.current) {
      const newName = nameRef.current.textContent || "";
      updatePromptInDB(undefined, newName.trim());
    }
  }, [updatePromptInDB]);

  const handleNameClick = useCallback(() => {
    if (nameRef.current) {
      nameRef.current.focus();
      // Select all text for easier editing
      const range = document.createRange();
      range.selectNodeContents(nameRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, []);

  const handleNameKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        nameRef.current?.blur();
      } else if (e.key === "Escape") {
        if (nameRef.current) {
          nameRef.current.textContent = data.name || "Prompt Node";
          nameRef.current.blur();
        }
      }
    },
    [data.name]
  );

  // Function to handle opening the full screen editor with animation data
  const handleOpenFullScreenEditor = useCallback(() => {
    if (textareaRef.current) {
      const rect = textareaRef.current.getBoundingClientRect();
      data.setEditingPrompt?.({
        id: id,
        name: data.name,
        prompt: data.prompt,
        animationOrigin: {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        },
      });
    } else {
      data.setEditingPrompt?.({
        id: id,
        name: data.name,
        prompt: data.prompt,
      });
    }
    publishPresence({
      name: myPresence?.name,
      lastName: myPresence.lastName,
      profilePicture: myPresence.profilePicture || undefined,
      color: myPresence.color,
      flowX: myPresence.flowX,
      flowY: myPresence.flowY,
      screenX: myPresence.screenX,
      screenY: myPresence.screenY,
      liveCommentText: prompt,
      promptId: id,
    });
  }, [id, data]);

  return (
    <>
      <Card
        className={`
        min-w-[400px] max-w-[1000px]
        ${selected ? "ring-2 ring-blue-500" : ""}
        shadow-lg hover:shadow-xl transition-shadow duration-200
      `}
      >
        <CardHeader className="h-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3
                ref={nameRef}
                contentEditable
                suppressContentEditableWarning
                onBlur={handleNameBlur}
                onClick={handleNameClick}
                onKeyDown={handleNameKeyDown}
                className="font-semibold text-lg cursor-text hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-1 py-0.5 transition-colors outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
                title="Click to edit name"
              >
                {data.name}
              </h3>
              {data.version && (
                <Badge variant="secondary" className="text-xs">
                  v{data.version}
                </Badge>
              )}
              {isSaving && (
                <Badge variant="outline" className="text-xs">
                  Saving...
                </Badge>
              )}

              {/* Show profile pictures of peers on this prompt */}
              {peersOnThisPrompt.length > 0 && (
                <div className="flex items-center gap-1 ml-2">
                  {peersOnThisPrompt.map((peer: any, index: number) => (
                    <div
                      key={peer.id || index}
                      className="relative"
                      title={`${peer.name || "Anonymous"} ${
                        peer.lastName || ""
                      } is viewing this prompt`}
                    >
                      {peer.profilePicture && (
                        <img
                          src={peer.profilePicture}
                          alt={`${peer.name || "User"}'s profile`}
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ borderColor: peer.color || "#ffffff" }}
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-[8px]">
              <Button
                variant="default"
                size="lg"
                className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white shadow-lg transition-all duration-300 border-0 px-6 py-2.5 !font-semibold backdrop-blur-sm animate-[heartbeat_1.5s_ease-in-out_infinite] hover:animate-none hover:scale-105 active:scale-95"
                onClick={handleOpenFullScreenEditor}
                style={{
                  animationName: "heartbeat",
                  animationDuration: "1.5s",
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                }}
              >
                <Sparkles className="h-4 w-4 text-white mr-2" />
                Chat with AI
              </Button>

              <style jsx>{`
                @keyframes heartbeat {
                  0% {
                    transform: scale(1);
                  }
                  14% {
                    transform: scale(1.03);
                  }
                  28% {
                    transform: scale(1);
                  }
                  42% {
                    transform: scale(1.03);
                  }
                  70% {
                    transform: scale(1);
                  }
                }
              `}</style>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="lg" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={async () => {
                      await db.transact([db.tx.prompts[id].delete()]);
                    }}
                  >
                    <Trash className="text-red-500 h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onDragStart={(e) => e.preventDefault()}
            onDrag={(e) => e.preventDefault()}
            className="nodrag"
          >
            <Textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => {
                handlePromptChange(e.target.value);
              }}
              onDrag={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              placeholder="Enter your prompt here..."
              className={`
              resize-none font-mono text-base leading-relaxed min-h-[150px] nodrag max-h-[600px]
              p-4 bg-gray-50/50
              focus:bg-white focus:ring-2 focus:ring-blue-500/20
              transition-colors duration-200
            `}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="text-xs text-gray-500 mb-[6px]">Variables: </p>
              <div className="flex items-center gap-2 max-w-[70%] flex-wrap">
                {data?.variables &&
                  data.variables
                    .split(", ")
                    .map((variable: string, index: number) => (
                      <Badge
                        variant="outline"
                        className="text-xs"
                        key={variable + index}
                      >
                        {variable}
                      </Badge>
                    ))}
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {prompt.length} characters
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Screen Prompt Editor */}
    </>
  );
};
