import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save, X, Edit3, Eye, EyeOff, Copy } from "lucide-react";
import { db } from "@/instant";

interface GeneralInformationSectionProps {
  activeProject: any;
  setActiveProject: (project: any) => void;
}

function GeneralInformationSection({
  activeProject,
  setActiveProject,
}: GeneralInformationSectionProps) {
  // State for project name editing
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);
  const [editedProjectName, setEditedProjectName] = useState("");
  const [savingProjectName, setSavingProjectName] = useState(false);

  // State for project key visibility
  const [showProjectKey, setShowProjectKey] = useState(false);

  // Function to copy project key to clipboard
  const handleCopyProjectKey = async () => {
    if (activeProject?.key) {
      try {
        await navigator.clipboard.writeText(activeProject.key);
      } catch (error) {
        console.error("Failed to copy project key:", error);
      }
    }
  };

  const handleEditProjectName = () => {
    setEditedProjectName(activeProject?.name || "");
    setIsEditingProjectName(true);
  };

  const handleSaveProjectName = async () => {
    if (!activeProject?.id || !editedProjectName.trim()) return;
    setSavingProjectName(true);
    try {
      await db.transact([
        db.tx.projects[activeProject.id].update({
          name: editedProjectName.trim(),
        }),
      ]);

      // Update the active project in context
      setActiveProject({
        ...activeProject,
        name: editedProjectName.trim(),
      });

      setIsEditingProjectName(false);
    } catch (error) {
      console.error("Error updating project name:", error);
    } finally {
      setSavingProjectName(false);
    }
  };

  const handleCancelEditProjectName = () => {
    setIsEditingProjectName(false);
    setEditedProjectName("");
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <Settings className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              General Information
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Manage project settings and configuration
            </p>
          </div>
        </div>
      </div>
      <div className="p-6">
        {/* Project Name Section */}
        <div className="space-y-2">
          <Label
            htmlFor="project-name"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Project Name
          </Label>
          {isEditingProjectName ? (
            <div className="flex gap-2">
              <Input
                id="project-name"
                type="text"
                value={editedProjectName}
                onChange={(e) => setEditedProjectName(e.target.value)}
                placeholder="Enter project name"
                className="flex-1 h-9 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveProjectName();
                  if (e.key === "Escape") handleCancelEditProjectName();
                }}
                autoFocus
              />
              <Button
                onClick={handleSaveProjectName}
                disabled={savingProjectName || !editedProjectName.trim()}
                size="sm"
                className="h-9 px-3 bg-green-600 hover:bg-green-700 text-white font-medium"
              >
                {savingProjectName ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={handleCancelEditProjectName}
                variant="outline"
                size="sm"
                className="h-9 px-3"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {activeProject?.name}
              </span>
              <Button
                onClick={handleEditProjectName}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-slate-600 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Project Key Section */}
        <div className="space-y-2 mt-4">
          <Label
            htmlFor="project-key"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Project Key
          </Label>
          <div className="flex gap-2">
            <Input
              id="project-key"
              type={showProjectKey ? "text" : "password"}
              value={activeProject?.key || ""}
              readOnly
              placeholder="No project key available"
              className="flex-1 bg-slate-50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 cursor-default"
            />
            <Button
              onClick={() => setShowProjectKey(!showProjectKey)}
              variant="outline"
              size="sm"
              className="h-9 px-3 text-slate-600 hover:text-slate-700 border-slate-300 dark:border-slate-600"
            >
              {showProjectKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={handleCopyProjectKey}
              variant="outline"
              size="sm"
              className="h-9 px-3 text-slate-600 hover:text-slate-700 border-slate-300 dark:border-slate-600"
              disabled={!activeProject?.key}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            This key is used to authenticate API requests to your project
          </p>
        </div>
      </div>
    </div>
  );
}

export default GeneralInformationSection;
