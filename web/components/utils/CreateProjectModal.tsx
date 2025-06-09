import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FolderPlus } from "lucide-react";
import { Button } from "../ui/button";
import { db } from "@/instant";
import { useGlobal } from "@/lib/context/GlobalContext";
import { id } from "@instantdb/react";

export const CreateProjectModal = ({
  isCreateProjectModalOpen,
  setIsCreateProjectModalOpen,
}: {
  isCreateProjectModalOpen: boolean;
  setIsCreateProjectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { profile, setActiveProject } = useGlobal();

  const handleCreateProject = async () => {
    if (!newProjectName.trim() || !profile?.userId) return;

    setIsCreating(true);
    try {
      const projectId = id();
      const now = Date.now();

      await db.transact([
        db.tx.projects[projectId]
          .update({
            name: newProjectName.trim(),
            key: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
          })
          .link({ $users: profile.userId }),
      ]);

      // Query the newly created project and set it as active
      const newProject = await db.queryOnce({
        projects: {
          $: {
            where: { id: projectId },
          },
        },
      });

      if (newProject?.data?.projects?.[0]) {
        setActiveProject(newProject.data.projects[0]);
      }

      // Close modal and reset form
      setIsCreateProjectModalOpen(false);
      setNewProjectName("");
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog
      open={isCreateProjectModalOpen}
      onOpenChange={setIsCreateProjectModalOpen}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create a new project</DialogTitle>
          <DialogDescription>
            Create a new project to start working on.
          </DialogDescription>
        </DialogHeader>
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
              onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
            />
            <Button
              disabled={!newProjectName.trim() || isCreating}
              size="sm"
              onClick={handleCreateProject}
            >
              <FolderPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsCreateProjectModalOpen(false);
              setNewProjectName("");
            }}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateProject}
            disabled={!newProjectName.trim() || isCreating}
          >
            {isCreating ? "Creating..." : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
