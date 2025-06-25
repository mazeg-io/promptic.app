"use client";

import React, { useEffect, useState } from "react";
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
import { db } from "@/instant";
import { id } from "@instantdb/react";

export const RightToolbar = ({ room }: { room: any }) => {
  const { theme, setTheme, activeProject } = useGlobal();
  const { user } = db.useAuth();
  const [isProjectSettingsModalOpen, setIsProjectSettingsModalOpen] =
    useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isSynced, setIsSynced] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  // Query all prompts for the active project
  const { data: promptsData } = db.useQuery(
    activeProject?.id
      ? {
          prompts: {
            $: {
              where: {
                project: activeProject.id,
              },
            },
            versions: {},
          },
        }
      : null
  );

  // Check sync status whenever prompts data changes
  useEffect(() => {
    if (promptsData?.prompts && promptsData.prompts.length > 0) {
      const allSynced = promptsData.prompts.every(
        (prompt) => prompt.liveContent === prompt.content
      );
      setIsSynced(allSynced);
    } else {
      // If no prompts, consider it synced
      setIsSynced(true);
    }
  }, [promptsData]);

  const handlePublish = async () => {
    if (isSynced || isPublishing || !user?.id) return;

    setIsPublishing(true);

    try {
      const promptsToSync =
        promptsData?.prompts?.filter(
          (prompt) => prompt.liveContent !== prompt.content
        ) || [];

      const transactionPromises = promptsToSync.map(async (prompt) => {
        const existingVersions = prompt.versions || [];
        const maxVersionNumber =
          existingVersions.length > 0
            ? Math.max(...existingVersions.map((v) => v.versionNumber))
            : 0;
        const nextVersionNumber = maxVersionNumber + 1;

        // (update + create version)
        return db.transact([
          db.tx.prompts[prompt.id].update({
            content: prompt.liveContent,
            updatedAt: Date.now(),
          }),
          db.tx.prompt_versions[id()]
            .update({
              promptId: prompt.id,
              versionNumber: nextVersionNumber,
              content: prompt.liveContent,
              variables: prompt.variables,
              name: prompt.name,
              userIdchangedBy: user.id,
              changeDescription: "Published from editor",
              createdAt: Date.now(),
            })
            .link({ prompt: prompt.id, $user: user.id }),
        ]);
      });

      // Execute all transactions concurrently
      await Promise.all(transactionPromises);

      // Show success feedback
      setIsPublished(true);
      setTimeout(() => {
        setIsPublished(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to sync prompts:", error);
    } finally {
      setIsPublishing(false);
    }
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
              View API Docs
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
                  : isSynced
                  ? "bg-gray-600 text-white hover:bg-gray-600 cursor-auto"
                  : isPublishing
                  ? "bg-purple-400 text-white hover:bg-purple-400 cursor-wait"
                  : "bg-purple-600 text-white hover:bg-purple-700"
                // isPublished
                //   ? "bg-green-600 text-white hover:bg-green-700"
                //   : "bg-purple-600 text-white hover:bg-purple-700"
              )}
              onClick={handlePublish}
            >
              {isPublished ? (
                <Check className="w-4 h-4" />
              ) : (
                <CloudAlert className="w-4 h-4" />
              )}
              {isPublished
                ? "Published"
                : isSynced
                ? "Synced"
                : isPublishing
                ? "Publishing..."
                : "Publish"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Sync prompts with api</TooltipContent>
        </Tooltip>
      </div>
    </>
  );
};
