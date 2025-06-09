import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, X } from "lucide-react";
import { db } from "@/instant";

interface TeamManagementSectionProps {
  activeProject: any;
  profile: any;
  projectData: any;
  loadingUsers: boolean;
}

function TeamManagementSection({
  activeProject,
  profile,
  projectData,
  loadingUsers,
}: TeamManagementSectionProps) {
  // State for adding users
  const [newUserEmail, setNewUserEmail] = useState("");
  const [addingUser, setAddingUser] = useState(false);

  const handleAddUser = async () => {
    if (!newUserEmail.trim() || !activeProject?.id) return;
    setAddingUser(true);
    try {
      const emailToSearch = newUserEmail.trim();
      const userQuery = await db.queryOnce({
        profiles: {
          $: {
            where: {
              email: emailToSearch,
            },
          },
        },
      });
      if (!userQuery.data.profiles || userQuery.data.profiles.length === 0) {
        return;
      }

      const userToAdd = userQuery.data.profiles[0];

      const isUserAlreadyInProject = projectData?.projects?.[0]?.$users?.some(
        (user: any) => user.id === userToAdd.userId
      );
      if (isUserAlreadyInProject) {
        return;
      }

      // Add user to project using the userProjects link
      await db.transact([
        db.tx.projects[activeProject.id].link({ $users: userToAdd.userId }),
      ]);

      setNewUserEmail("");
    } catch (error) {
      console.error("Error adding user to project:", error);
    } finally {
      setAddingUser(false);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!activeProject?.id || userId === profile?.userId) return;
    await db.transact([
      db.tx.projects[activeProject.id].unlink({
        $users: userId,
      }),
    ]);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Team Management
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {projectData?.projects?.[0]?.$users?.length || 0} member
                {(projectData?.projects?.[0]?.$users?.length || 0) !== 1
                  ? "s"
                  : ""}{" "}
                in this project
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Add User Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="user-email"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Email Address
            </Label>
            <div className="flex gap-3">
              <Input
                id="user-email"
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="flex-1 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                onKeyDown={(e) => e.key === "Enter" && handleAddUser()}
              />
              <Button
                onClick={handleAddUser}
                disabled={addingUser || !newUserEmail.trim()}
                className="px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {addingUser ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </div>
                ) : (
                  "Add User"
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-700"></div>

        {/* Team Members List */}
        <div className="space-y-4">
          {loadingUsers ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
                Loading team members...
              </div>
            </div>
          ) : projectData?.projects?.[0]?.$users?.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                No team members yet
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                Add your first team member above
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {projectData?.projects?.[0]?.$users?.map((projectUser: any) => (
                <div
                  key={projectUser.id}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 ring-2 ring-white dark:ring-slate-700">
                      {projectUser?.profile?.profilePicture ? (
                        <img
                          src={projectUser.profile.profilePicture}
                          alt={`${projectUser.profile.firstName} ${projectUser.profile.lastName}`}
                          className="h-full w-full object-cover"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            // Try without crossOrigin if it fails
                            const img = e.target as HTMLImageElement;
                            if (img.crossOrigin) {
                              img.crossOrigin = "";
                              img.src = img.src; // Reload the image
                            }
                          }}
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                          {projectUser.profile?.firstName?.[0] ||
                            projectUser.email[0].toUpperCase()}
                        </div>
                      )}
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {projectUser?.profile
                            ? `${projectUser?.profile?.firstName} ${projectUser?.profile?.lastName}`
                            : projectUser?.email}
                        </p>
                        {projectUser?.id === profile?.userId && (
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs"
                          >
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{projectUser?.email}</span>
                      </div>
                    </div>
                  </div>

                  {projectUser.id !== profile?.userId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveUser(projectUser.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 ml-4"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeamManagementSection;
