"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import {
  Wand2,
  RefreshCw,
  Sparkles,
  Copy,
  Save,
  MoreHorizontal,
  Maximize2,
  Minimize2,
  Trash,
} from "lucide-react";
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

export interface PromptNodeData extends Record<string, unknown> {
  name: string;
  prompt: string;
  variables: string;
  isExpanded?: boolean;
  version?: number;
  tags?: string[];
  information?: {
    id: string;
    positionX: number;
    positionY: number;
    height: number;
    width: number;
    isExpanded: boolean;
    nodeType: string;
  };
}

type PromptNodeProps = NodeProps & {
  data: PromptNodeData;
};

export const PromptNode: React.FC<PromptNodeProps> = ({
  data,
  id,
  selected,
}) => {
  const [prompt, setPrompt] = useState(data.prompt || "");
  const [name, setName] = useState(data.name || "Prompt Node");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Content tracking refs
  const intervalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContentRef = useRef<string>(data.prompt || "");
  const currentContentRef = useRef<string>(data.prompt || "");

  const nameRef = useRef<HTMLHeadingElement>(null);

  const extractVariables = useCallback((prompt: string) => {
    const variables = prompt.match(/{{.*?}}/g);
    return variables
      ?.map((variable) => variable.replace(/{{|}}/g, ""))
      .join(", ");
  }, []);

  // Function to update the database
  const updatePromptInDB = useCallback(
    async (newContent?: string, newName?: string) => {
      if (!id) return;

      const updates: any = {};
      if (newContent && newContent !== lastSavedContentRef.current) {
        updates.content = newContent;
      }
      if (newName !== undefined && newName !== data.name) {
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
        if (newContent && updates.content) {
          lastSavedContentRef.current = newContent;
        }
      } catch (error) {
        console.error("Failed to update prompt:", error);
      } finally {
        setIsSaving(false);
      }
    },
    [id, data.name]
  );

  // Handle name changes
  const handleNameBlur = useCallback(() => {
    if (nameRef.current) {
      const newName = nameRef.current.textContent || "";
      setName(newName);
      if (newName.trim() !== data.name) {
        updatePromptInDB(currentContentRef.current, newName.trim());
      }
    }
  }, [data.name, updatePromptInDB]);

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

  // Handle prompt content changes with interval-based updates
  const handlePromptChange = useCallback(
    (newContent: string) => {
      setPrompt(newContent);
      currentContentRef.current = newContent;

      // If no interval is running, start one
      if (!intervalTimerRef.current) {
        intervalTimerRef.current = setInterval(() => {
          // Check if content has changed since last save
          if (currentContentRef.current !== lastSavedContentRef.current) {
            updatePromptInDB(currentContentRef.current);
          }
        }, 500);
      }
    },
    [updatePromptInDB]
  );

  // Stop interval when user stops typing (after a delay)
  const stopInterval = useCallback(() => {
    if (intervalTimerRef.current) {
      clearInterval(intervalTimerRef.current);
      intervalTimerRef.current = null;
      // Send final update if there are unsaved changes
      if (currentContentRef.current !== lastSavedContentRef.current) {
        updatePromptInDB(currentContentRef.current);
      }
    }
  }, [updatePromptInDB]);

  // Update local state when data changes (from external updates)
  useEffect(() => {
    setPrompt(data.prompt || "");
    setName(data.name || "Prompt Node");
    currentContentRef.current = data.prompt || "";
    lastSavedContentRef.current = data.prompt || "";

    // Update the contentEditable element if it exists
    if (
      nameRef.current &&
      nameRef.current.textContent !== (data.name || "Prompt Node")
    ) {
      nameRef.current.textContent = data.name || "Prompt Node";
    }
  }, [data.prompt, data.name]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (intervalTimerRef.current) {
        clearInterval(intervalTimerRef.current);
      }
    };
  }, []);

  // Stop content interval after user stops typing for 1 second
  useEffect(() => {
    const stopTimer = setTimeout(stopInterval, 1000);
    return () => clearTimeout(stopTimer);
  }, [prompt, stopInterval]);

  return (
    <>
      <Card
        className={`
        min-w-[400px] max-w-[1000px]
        ${selected ? "ring-2 ring-blue-500" : ""}
        shadow-lg hover:shadow-xl transition-shadow duration-200
      `}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-blue-500"
        />

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
                className="font-semibold text-sm cursor-text hover:bg-gray-100 rounded px-1 py-0.5 transition-colors outline-none focus:ring-1 focus:ring-blue-500"
                title="Click to edit name"
              >
                {name}
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
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Maximize2 className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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

        <CardContent className="space-y-3">
          <div
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onDragStart={(e) => e.preventDefault()}
            onDrag={(e) => e.preventDefault()}
            className="nodrag"
          >
            <Textarea
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
              resize-none font-mono text-sm min-h-[150px] nodrag
            `}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-[6px]">Variables: </p>
              <div className="flex items-center gap-2 max-w-[70%] flex-wrap">
                {data?.variables &&
                  data.variables.split(", ").map((variable: string) => (
                    <Badge variant="outline" className="text-xs">
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

        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-green-500"
        />
      </Card>
    </>
  );
};
