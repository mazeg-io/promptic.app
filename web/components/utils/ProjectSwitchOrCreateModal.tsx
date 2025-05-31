import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FolderPlus, Layers, Search } from "lucide-react";
import { Button } from "../ui/button";
import { db } from "@/instant";
import { useGlobal } from "@/lib/context/GlobalContext";

function ProjectSwitchOrCreateModal({
  isProjectModalOpen,
  setIsProjectModalOpen,
}: {
  isProjectModalOpen: boolean;
  setIsProjectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const { activeProject, profile, setActiveProject } = useGlobal();
  const { data: projectsData } = db.useQuery({
    projects: {
      $: {
        where: { $users: profile?.userId || "" },
      },
    },
  });
  return (
    <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Project Switcher</DialogTitle>
          <DialogDescription>
            Switch between projects or create a new one.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Project List */}

          <div className="overflow-y-auto space-y-2">
            {projectsData?.projects.map((project) => (
              <Card
                className={`py-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  activeProject?.id === project.id
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : ""
                }`}
                onClick={() => {
                  setActiveProject(project);
                }}
              >
                <CardContent className="">
                  <div className="flex items-center gap-3">
                    <Layers className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{project.name}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="border-t pt-4">
            <Label htmlFor="new-project-name" className="text-sm font-medium">
              Create New Project
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="new-project-name"
                placeholder="Enter project name..."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
              <Button disabled={!newProjectName.trim()} size="sm">
                <FolderPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              db.auth.signOut();
            }}
          >
            Logout
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsProjectModalOpen(false);
              setSearchQuery("");
              setNewProjectName("");
            }}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ProjectSwitchOrCreateModal;
