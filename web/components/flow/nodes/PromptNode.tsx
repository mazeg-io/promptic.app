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
  label: string;
  prompt: string;
  isExpanded?: boolean;
  version?: number;
  tags?: string[];
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const intervalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContentRef = useRef<string>(data.prompt || "");
  const currentContentRef = useRef<string>(data.prompt || "");

  // Function to update the database
  const updatePromptInDB = useCallback(
    async (newContent: string) => {
      if (!id || newContent === lastSavedContentRef.current) return;

      try {
        setIsSaving(true);
        await db.transact([
          db.tx.prompts[id].update({
            content: newContent,
            updatedAt: Date.now(),
          }),
        ]);
        lastSavedContentRef.current = newContent;
      } catch (error) {
        console.error("Failed to update prompt:", error);
      } finally {
        setIsSaving(false);
      }
    },
    [id]
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

  // Update local state when data.prompt changes (from external updates)
  useEffect(() => {
    setPrompt(data.prompt || "");
    currentContentRef.current = data.prompt || "";
    lastSavedContentRef.current = data.prompt || "";
  }, [data.prompt]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (intervalTimerRef.current) {
        clearInterval(intervalTimerRef.current);
      }
    };
  }, []);

  // Stop interval after user stops typing for 1 second
  useEffect(() => {
    const stopTimer = setTimeout(stopInterval, 100);
    return () => clearTimeout(stopTimer);
  }, [prompt, stopInterval]);

  return (
    <>
      <p>asd asd</p>
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
              <h3 className="font-semibold text-sm">
                {data.label || "Prompt Node"}
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
                  <DropdownMenuItem>
                    <Trash className="text-red-500 h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <Textarea
            value={prompt}
            onChange={(e) => {
              handlePromptChange(e.target.value);
            }}
            placeholder="Enter your prompt here..."
            className={`
            resize-none font-mono text-sm min-h-[150px]
          `}
            disabled={isLoading}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading || !prompt.trim()}
                className="flex items-center gap-2"
              >
                <Wand2 className="h-4 w-4" />
                Enhance
              </Button>
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
