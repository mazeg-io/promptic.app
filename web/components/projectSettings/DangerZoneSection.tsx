import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { db } from "@/instant";

interface DangerZoneSectionProps {
  activeProject: any;
  setActiveProject: (project: any) => void;
  userProjectsData: any;
  onClose: () => void;
}

function DangerZoneSection({
  activeProject,
  setActiveProject,
  userProjectsData,
  onClose,
}: DangerZoneSectionProps) {
  // State for project deletion
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);

  const handleDeleteProject = async () => {
    if (!activeProject?.id) return;
    setDeletingProject(true);
    try {
      await db.transact([db.tx.projects[activeProject.id].delete()]);

      // Switch to the first available project or null
      const remainingProjects = userProjectsData?.projects?.filter(
        (p: any) => p.id !== activeProject.id
      );
      setActiveProject(remainingProjects?.[0] || null);

      onClose();
      alert("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
    } finally {
      setDeletingProject(false);
      setShowDeleteConfirmation(false);
    }
  };

  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
          <div>
            <p className="font-medium text-red-900 dark:text-red-100">
              Delete Project
            </p>
            <p className="text-sm text-red-700 dark:text-red-300">
              This action cannot be undone. All project data will be permanently
              deleted.
            </p>
          </div>
        </div>
        {!showDeleteConfirmation ? (
          <Button
            onClick={() => setShowDeleteConfirmation(true)}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleDeleteProject}
              disabled={deletingProject}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deletingProject ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </div>
              ) : (
                "Confirm Delete"
              )}
            </Button>
            <Button
              onClick={() => setShowDeleteConfirmation(false)}
              variant="outline"
              className="border-slate-300 dark:border-slate-600"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DangerZoneSection;
