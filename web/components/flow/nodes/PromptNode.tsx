"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { NodeProps } from "@xyflow/react";
import {
  Sparkles,
  MoreHorizontal,
  Trash,
  Edit3,
  FileText,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useGlobal } from "@/lib/context/GlobalContext";
import PromptNodeStarter from "./PromptNodeStarter";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const { profile } = useGlobal();
  const [prompt, setPrompt] = useState(data.prompt);
  const [localVariables, setLocalVariables] = useState(data.variables || "");
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

  // Update local variables when data.variables changes
  useEffect(() => {
    setLocalVariables(data.variables || "");
  }, [data.variables]);

  // Memoize the prompt availability check
  const hasPromptContent = React.useMemo(
    () => prompt.length > 0,
    [prompt.length]
  );

  const extractVariables = useCallback((prompt: string) => {
    const variables = prompt.match(/{{.*?}}/g);
    const extractedVars = variables
      ?.map((variable) => variable.replace(/{{|}}/g, "").trim())
      .filter((variable) => variable.length > 0)
      .join(", ");
    return extractedVars || "";
  }, []);

  // Function to update the database and node
  const updatePromptInDB = useCallback(
    async (newContent?: string, newName?: string) => {
      if (!id) return;

      const contentToUse = newContent != null ? newContent : data.prompt;
      const nameToUse = newName != null ? newName : data.name;
      const newVariables = extractVariables(contentToUse);

      const updates: Record<string, unknown> = {};
      if (newContent != null) {
        updates.liveContent = newContent;
      }
      if (
        newName !== undefined &&
        newName !== data.name &&
        newName.trim() !== ""
      ) {
        updates.name = newName;
      }

      // Always update variables if content changed
      if (newContent != null) {
        updates.variables = newVariables;
      }

      if (Object.keys(updates).length === 0) return;

      try {
        await db.transact([
          db.tx.prompts[id].update({
            ...updates,
            updatedAt: Date.now(),
          }),
        ]);

        // Update local variables state immediately
        if (newContent != null) {
          setLocalVariables(newVariables);
        }

        // Update the node data directly
        if (data.updateNode) {
          data.updateNode(id, {
            prompt: contentToUse,
            name: nameToUse,
            variables: newVariables,
          });
        }
      } catch (error) {
        console.error("Failed to update prompt:", error);
      }
    },
    [id, data, extractVariables]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Handle prompt content changes with debouncing
  const handlePromptChange = useCallback(
    (newContent: string) => {
      // Update local state immediately
      setPrompt(newContent);

      // Extract and update variables immediately for UI responsiveness
      const newVariables = extractVariables(newContent);
      setLocalVariables(newVariables);

      // Clear any existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set a new timeout for database update
      debounceTimeoutRef.current = setTimeout(() => {
        updatePromptInDB(newContent);
      }, 500); // 500ms debounce
    },
    [updatePromptInDB, extractVariables]
  );

  // Handle name changes
  const handleNameBlur = useCallback(() => {
    if (nameRef.current) {
      const newName = nameRef.current.textContent || "";
      updatePromptInDB(undefined, newName.trim());
    }
  }, [updatePromptInDB]);

  const handleNameClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the editor when clicking name
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
    data.setEditingPrompt?.({
      id: id,
      name: data.name,
      prompt: data.prompt,
    });
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
      userId: profile?.userId, // Add userId for deduplication
    });
  }, [id, data, profile?.userId, myPresence, publishPresence, prompt]);

  // Function to truncate prompt text for preview
  const getPromptPreview = useCallback(
    (text: string, maxLength: number = 200) => {
      if (text.length <= maxLength) return text;
      return text.slice(0, maxLength) + "...";
    },
    []
  );

  return (
    <>
      <Card
        className={`
          min-w-[500px] max-w-[500px] cursor-pointer
          ${selected ? "ring-2 ring-blue-500" : ""}
          shadow-lg hover:shadow-xl transition-all duration-200
          ${hasPromptContent ? "hover:scale-[1.02]" : ""}
          group
        `}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3
                ref={nameRef}
                contentEditable
                suppressContentEditableWarning
                onBlur={handleNameBlur}
                onClick={handleNameClick}
                onKeyDown={handleNameKeyDown}
                className="font-bold text-[22px] cursor-text hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-1 py-0.5 transition-colors outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
                title="Click to edit name"
              >
                {data.name}
              </h3>
              {data.version && (
                <Badge variant="secondary" className="text-xs">
                  v{data.version}
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
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <img
                              src={peer.profilePicture}
                              alt={`${peer.name || "User"}'s profile`}
                              className="w-[28px] h-[28px] rounded-full border-2 border-white shadow-sm"
                              style={{ borderColor: peer.color || "#ffffff" }}
                              referrerPolicy="no-referrer"
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            {peer.name} {peer.lastName}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={async (e) => {
                    e.stopPropagation();
                    await db.transact([db.tx.prompts[id].delete()]);
                  }}
                >
                  <Trash className="text-red-500 h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Main Content Area */}
          <div className="space-y-4">
            {hasPromptContent ? (
              <>
                {/* Prompt Preview */}
                <div
                  onDoubleClick={handleOpenFullScreenEditor}
                  className="bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-mono leading-relaxed whitespace-pre-wrap break-words">
                        {getPromptPreview(prompt)}
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Edit3 className="h-3 w-3" />
                          Click to edit in full screen
                        </div>
                        <div className="text-xs text-gray-500">
                          {prompt.length} characters
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  variant="default"
                  className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white shadow-lg transition-all duration-300 border-0 py-2.5 font-semibold group-hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenFullScreenEditor();
                  }}
                >
                  <Sparkles className="h-4 w-4 text-white mr-2" />
                  Update with AI
                </Button>
              </>
            ) : (
              <>
                {/* Prompt Templates */}
                <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-colors">
                  <PromptNodeStarter
                    handlePromptChange={handlePromptChange}
                    textareaRef={textareaRef}
                  />
                </div>

                {/* Action Button */}
                <Button
                  variant="default"
                  className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white shadow-lg transition-all duration-300 border-0 py-2.5 font-semibold animate-pulse hover:animate-none group-hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenFullScreenEditor();
                  }}
                >
                  <Sparkles className="h-4 w-4 text-white mr-2" />
                  Generate with AI
                </Button>
              </>
            )}

            {/* Variables Section */}
            <div>
              {localVariables ? (
                <>
                  <p className="text-xs text-gray-500 mb-2 font-medium">
                    Variables:
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {localVariables
                      .split(", ")
                      .filter((variable: string) => variable.trim().length > 0)
                      .map((variable: string, index: number) => (
                        <Badge
                          variant="outline"
                          className="text-xs bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                          key={variable + index}
                        >
                          {variable}
                        </Badge>
                      ))}
                  </div>
                </>
              ) : hasPromptContent ? (
                <p className="text-xs text-gray-400 italic">
                  Use format {"{{"}variable{"}}"} to include variables
                </p>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
