"use client";

import React, { useState } from "react";
import { CloudAlert, Cable, Sun, Moon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectSettingsModal from "@/components/utils/ProjectSettingsModal";
import ToolbarOnlineUsers from "./ToolbarOnlineUsers";
import { useGlobal } from "@/lib/context/GlobalContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DocsModal from "@/components/utils/DocsModal";
import { cn } from "@/lib/utils";

export const RightToolbar = ({ room }: { room: any }) => {
  const { theme, setTheme } = useGlobal();
  const [isProjectSettingsModalOpen, setIsProjectSettingsModalOpen] =
    useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const handlePublish = () => {
    setIsPublished(true);
    setTimeout(() => {
      setIsPublished(false);
    }, 2000);
  };

  return (
    <>
      {isProjectSettingsModalOpen && (
        <ProjectSettingsModal
          isOpen={isProjectSettingsModalOpen}
          onClose={() => setIsProjectSettingsModalOpen(false)}
        />
      )}
      {isDocsModalOpen && (
        <DocsModal
          isOpen={isDocsModalOpen}
          onClose={() => setIsDocsModalOpen(false)}
        />
      )}
      <div className="absolute top-4 right-4 z-10 h-[50px] flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg px-2 border">
        <ToolbarOnlineUsers room={room} />
        <div className="h-full w-[1px] mx-[8px] bg-r bg-gray-300 dark:bg-gray-600" />
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "flex items-center gap-2 mr-2 transition-all duration-300",
            theme === "light"
              ? "bg-white dark:bg-gray-800 hover:bg-white hover:dark:bg-gray-800"
              : "bg-gray-800 dark:bg-gray-200 hover:bg-gray-800 hover:dark:bg-gray-200"
          )}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? (
            <Sun className="w-4 h-4 text-gray-800 dark:text-gray-200" />
          ) : (
            <Moon className="w-4 h-4 text-white dark:text-gray-800" />
          )}
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 mr-2"
              onClick={() => setIsDocsModalOpen(true)}
            >
              <Cable className="w-4 h-4" />
              Connect API
            </Button>
          </TooltipTrigger>
          <TooltipContent>Connect to your api</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="lg"
              className={cn(
                "flex items-center gap-2 transition-colors duration-200",
                isPublished
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              )}
              onClick={handlePublish}
            >
              {isPublished ? (
                <Check className="w-4 h-4" />
              ) : (
                <CloudAlert className="w-4 h-4" />
              )}
              {isPublished ? "Published" : "Publish"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Sync prompts with api</TooltipContent>
        </Tooltip>
      </div>
    </>
  );
};
