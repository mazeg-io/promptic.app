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
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import ProjectSettingsModal from "@/components/utils/ProjectSettingsModal";

export const FlowToolbar: React.FC = () => {
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
        <div className="flex items-center gap-1">
          {["🔥", "👋", "🎉", "❤️"].map((icon) => (
            <div
              key={icon}
              className="cursor-pointer w-[40px] h-[40px] hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-2 transition-colors"
              title={icon}
            >
              {icon}
            </div>
          ))}
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-[4px]">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
            </Avatar>
            <Avatar>
              <AvatarImage src="https://github.com/leerob.png" />
            </Avatar>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setIsProjectSettingsModalOpen(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};
