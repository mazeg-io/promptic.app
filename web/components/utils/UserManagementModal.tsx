import React from "react";
import { DialogContent, DialogHeader } from "../ui/dialog";
import { Dialog, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import TeamManagementSection from "../projectSettings/TeamManagementSection";
import { db } from "@/instant";
import { useGlobal } from "@/lib/context/GlobalContext";

function UserManagementModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { profile, activeProject } = useGlobal();

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="!max-w-[800px] !gap-0 !p-0 overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-0 shadow-2xl"
      >
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 -mx-6 -mt-6 px-[32px] py-5">
          <DialogHeader className="space-y-0">
            <div className="flex items-center justify-between px-[16px] pt-[24px]">
              <div className="flex items-center gap-3">
                <div>
                  <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Invite User
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
                    User must be registered to Promptic
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>
        {/* Content Section */}
        <div className="overflow-y-auto max-h-[calc(85vh-140px)] space-y-[16px] px-[16px] py-6">
          {/* Team Management Section */}
          <TeamManagementSection
            activeProject={activeProject}
            profile={profile}
            projectData={projectData}
            loadingUsers={loadingUsers}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UserManagementModal;
