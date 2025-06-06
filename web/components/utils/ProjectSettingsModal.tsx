import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { db } from "@/instant";
import { useGlobal } from "@/lib/context/GlobalContext";
import CreateProjectModal from "./CreateProjectModal";
import ProjectHeader from "@/components/projectSettings/ProjectHeader";
import GeneralInformationSection from "@/components/projectSettings/GeneralInformationSection";
import TeamManagementSection from "@/components/projectSettings/TeamManagementSection";
import DangerZoneSection from "@/components/projectSettings/DangerZoneSection";

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ProjectSettingsModal({ isOpen, onClose }: ProjectSettingsModalProps) {
  const { profile, activeProject, setActiveProject } = useGlobal();

  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false);

  // Query to get all user projects for the dropdown
  const { data: userProjectsData } = db.useQuery(
    profile?.userId
      ? {
          projects: {
            $: {
              where: {
                $users: profile.userId,
              },
            },
          },
        }
      : null
  );

  // Query to get project users using InstantDB hook
  const { data: projectData, isLoading: loadingUsers } = db.useQuery(
    activeProject?.id
      ? {
          projects: {
            $: {
              where: {
                id: activeProject.id,
              },
            },
            $users: {
              profile: {},
            },
          },
        }
      : null
  );

  return (
    <>
      {isCreateProjectModalOpen && (
        <CreateProjectModal
          isCreateProjectModalOpen={isCreateProjectModalOpen}
          setIsCreateProjectModalOpen={setIsCreateProjectModalOpen}
        />
      )}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          showCloseButton={false}
          className="!max-w-[800px] max-h-[85vh]  !gap-0 !p-0 overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-0 shadow-2xl"
        >
          {/* Header Section */}
          <ProjectHeader
            activeProject={activeProject}
            setActiveProject={setActiveProject}
            userProjectsData={userProjectsData}
            setIsCreateProjectModalOpen={setIsCreateProjectModalOpen}
          />

          {/* Content Section */}
          <div className="overflow-y-auto max-h-[calc(85vh-140px)] space-y-[16px] px-[16px] py-6">
            {/* General Information Section */}
            <GeneralInformationSection
              activeProject={activeProject}
              setActiveProject={setActiveProject}
            />

            {/* Team Management Section */}
            <TeamManagementSection
              activeProject={activeProject}
              profile={profile}
              projectData={projectData}
              loadingUsers={loadingUsers}
            />

            {/* Danger Zone Section */}
            <DangerZoneSection
              activeProject={activeProject}
              setActiveProject={setActiveProject}
              userProjectsData={userProjectsData}
              onClose={onClose}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ProjectSettingsModal;
