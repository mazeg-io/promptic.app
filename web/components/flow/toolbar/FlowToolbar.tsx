"use client";

import React, { useState } from "react";
import {
  Play,
  Square,
  RotateCcw,
  Save,
  Download,
  Upload,
  Settings,
  Zap,
  Layers,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectSettingsModal from "@/components/utils/ProjectSettingsModal";
import ToolbarOnlineUsers from "./ToolbarOnlineUsers";
import { useGlobal } from "@/lib/context/GlobalContext";

export const FlowToolbar = ({ room }: { room: any }) => {
  const { activeProject } = useGlobal();
  const [isProjectSettingsModalOpen, setIsProjectSettingsModalOpen] =
    useState(false);

  return (
    <>
      {isProjectSettingsModalOpen && (
        <ProjectSettingsModal
          isOpen={isProjectSettingsModalOpen}
          onClose={() => setIsProjectSettingsModalOpen(false)}
        />
      )}
      <div className="absolute top-4 left-4 z-10 h-[50px] flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg px-2 border">
        <div className="flex items-center gap-[4px] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md  h-[calc(100%-16px)] px-[8px]  p-2">
          <Layers className="text-gray-600 w-[18px] h-[18px]" />
          <ChevronDown className="text-gray-600 w-[12px] h-[12px]" />
        </div>
        <div className="h-full flex items-center">
          <p className="text-gray-800 text-xs h-[calc(100%-16px)] font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-[8px] flex items-center">
            {activeProject?.name}
          </p>
        </div>
        <div className="h-full w-[1px] mx-[8px] bg-r bg-gray-300 dark:bg-gray-600" />
        <ToolbarOnlineUsers room={room} />
        <div className="h-full w-[1px] mx-[8px] bg-r bg-gray-300 dark:bg-gray-600" />

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setIsProjectSettingsModalOpen(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};
