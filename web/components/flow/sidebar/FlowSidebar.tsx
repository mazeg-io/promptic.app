"use client";

import React, { useState } from "react";
import {
  Plus,
  Type,
  Layers,
  Settings,
  PlusIcon,
  Menu,
  CircleEllipsis,
  Logs,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectSwitchOrCreateModal from "@/components/utils/ProjectSwitchOrCreateModal";
import { Node } from "@xyflow/react";
import { useGlobal } from "@/lib/context/GlobalContext";

interface NodePaletteItem {
  type: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface FlowSidebarProps {
  handleCreatePromptNode: () => void;
  nodes: Node[];
  focusNode: (nodeId: string) => void;
}

const nodePalette: NodePaletteItem[] = [
  {
    type: "promptNode",
    label: "Prompt Node",
    icon: <Type className="h-4 w-4" />,
    description: "AI prompt with enhancement tools",
  },
];

export const FlowSidebar: React.FC<FlowSidebarProps> = ({
  handleCreatePromptNode,
  nodes,
  focusNode,
}) => {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const { activeProject } = useGlobal();
  return (
    <>
      {isProjectModalOpen && (
        <ProjectSwitchOrCreateModal
          isProjectModalOpen={isProjectModalOpen}
          setIsProjectModalOpen={setIsProjectModalOpen}
        />
      )}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Layers className="h-5 w-5 flex-shrink-0" />
              <h2 className="text-lg font-semibold truncate">
                {activeProject?.name}
              </h2>
            </div>
            <Button
              onClick={() => setIsProjectModalOpen(true)}
              variant="ghost"
              size="icon"
            >
              <Logs />
            </Button>
          </div>
        </div>

        <div className="px-[16px] mt-[16px]">
          <Button
            onClick={handleCreatePromptNode}
            className="w-full"
            size={"lg"}
          >
            <PlusIcon />
            Add new prompt
          </Button>
        </div>
        <div className="px-[16px] mt-[16px]">
          <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
            Active Prompts ({nodes.length})
          </h3>
          <div className="space-y-2">
            {nodes.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No nodes in the flow yet
              </div>
            ) : (
              nodes.map((node) => (
                <Card
                  key={node.id}
                  className="px-2 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => focusNode(node.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Type className="h-4 w-4 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">
                          {(node.data as any)?.name || node.type}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};
