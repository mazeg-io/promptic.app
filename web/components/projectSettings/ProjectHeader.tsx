import React from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Layers, ChevronDown, Plus, Settings } from "lucide-react";

interface ProjectHeaderProps {
  activeProject: any;
  setActiveProject: (project: any) => void;
  userProjectsData: any;
  setIsCreateProjectModalOpen: (open: boolean) => void;
}

function ProjectHeader({
  activeProject,
  setActiveProject,
  userProjectsData,
  setIsCreateProjectModalOpen,
}: ProjectHeaderProps) {
  return (
    <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 -mx-6 -mt-6 px-6 py-5">
      <DialogHeader className="space-y-0">
        <div className="flex items-center justify-between px-[16px] pt-[24px]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Project Settings
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Manage your project and team members
              </DialogDescription>
            </div>
          </div>

          {/* Project Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600"
              >
                <Layers className="h-4 w-4" />
                <span className="font-medium">{activeProject?.name}</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <div className="px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Your Projects
              </div>
              {userProjectsData?.projects?.map((project: any) => (
                <DropdownMenuItem
                  key={project.id}
                  onClick={() => setActiveProject(project)}
                  className={`flex items-center gap-3 px-3 py-2.5 mx-1 rounded-md ${
                    activeProject?.id === project.id
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activeProject?.id === project.id
                        ? "bg-blue-500"
                        : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  />
                  <span className="font-medium truncate">{project.name}</span>
                  {activeProject?.id === project.id && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Active
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem
                onClick={() => setIsCreateProjectModalOpen(true)}
                className="flex items-center gap-3 px-3 py-2.5 mx-1 rounded-md text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Plus className="h-4 w-4" />
                <span className="font-medium">Create New Project</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </DialogHeader>
    </div>
  );
}

export default ProjectHeader;
