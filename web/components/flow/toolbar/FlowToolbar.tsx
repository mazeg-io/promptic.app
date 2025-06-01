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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProjectSettingsModal from "@/components/utils/ProjectSettingsModal";
import ToolbarEmojies from "./ToolbarEmojies";
import ToolbarOnlineUsers from "./ToolbarOnlineUsers";

export const FlowToolbar = ({ room }: { room: any }) => {
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
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 border">
        <ToolbarEmojies room={room} />

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

        {/* <ToolbarOnlineUsers room={room} /> */}

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
