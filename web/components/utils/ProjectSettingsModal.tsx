import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Users, Mail, X } from "lucide-react";
import { db } from "@/instant";
import { useGlobal } from "@/lib/context/GlobalContext";
import { IProject } from "@/interaces/IProject";
import { IUserProfile } from "@/interaces/IUser";
import { id } from "@instantdb/react";

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProjectUser {
  id: string;
  email: string;
  profile?: {
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
}

function ProjectSettingsModal({ isOpen, onClose }: ProjectSettingsModalProps) {
  const { profile, activeProject } = useGlobal();

  // State for adding users
  const [newUserEmail, setNewUserEmail] = useState("");
  const [addingUser, setAddingUser] = useState(false);

  // State for removing users
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);

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

  // Extract project users from query data
  const projectUsers: ProjectUser[] =
    projectData?.projects?.[0]?.$users?.map((user: any) => ({
      id: user.id,
      email: user.email,
      profile: user.profile
        ? {
            firstName: user.profile.firstName,
            lastName: user.profile.lastName,
            profilePicture: user.profile.profilePicture,
          }
        : undefined,
    })) || [];

  // Function to add user to project
  const handleAddUser = async () => {
    if (!newUserEmail.trim() || !activeProject?.id) return;

    setAddingUser(true);
    try {
      const emailToSearch = newUserEmail.trim();

      // First, check if user exists by email using a separate query
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
        alert(
          `User with email "${emailToSearch}" not found. The user must be registered first.`
        );
        return;
      }

      const userToAdd = userQuery.data.profiles[0];

      // Check if user is already in the project
      const isUserAlreadyInProject = projectUsers.some(
        (user) => user.id === userToAdd.userId
      );
      if (isUserAlreadyInProject) {
        alert("User is already in this project");
        return;
      }

      // Add user to project using the userProjects link
      const result = await db.transact([
        db.tx.projects[activeProject.id].link({
          $users: userToAdd.userId,
        }),
      ]);
      console.log("result", result);

      alert("User added to project successfully");
      setNewUserEmail("");
    } catch (error) {
      console.error("Error adding user to project:", error);
      alert("Failed to add user to project");
    } finally {
      setAddingUser(false);
    }
  };

  // Function to remove user from project
  const handleRemoveUser = async (userId: string) => {
    if (!activeProject?.id || userId === profile?.userId) return;

    setRemovingUserId(userId);
    try {
      // Remove user from project using the userProjects link
      await db.transact([
        db.tx.projects[activeProject.id].unlink({
          $users: userId,
        }),
      ]);

      alert("User removed from project");
    } catch (error) {
      console.error("Error removing user from project:", error);
      alert("Failed to remove user from project");
    } finally {
      setRemovingUserId(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Project Users
          </DialogTitle>
          <DialogDescription>Manage users in your project.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add User Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add New User
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-email">Email Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="user-email"
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="Enter user email"
                    onKeyDown={(e) => e.key === "Enter" && handleAddUser()}
                  />
                  <Button
                    onClick={handleAddUser}
                    size="sm"
                    disabled={addingUser || !newUserEmail.trim()}
                  >
                    {addingUser ? "Adding..." : "Add"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users List Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Current Users ({projectUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingUsers ? (
                <div className="text-center py-4">Loading users...</div>
              ) : projectUsers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No users found
                </div>
              ) : (
                <div className="space-y-3">
                  {projectUsers.map((projectUser) => (
                    <div
                      key={projectUser.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          {projectUser?.profile?.profilePicture ? (
                            <img
                              src={projectUser.profile.profilePicture}
                              alt={`${projectUser.profile.firstName} ${projectUser.profile.lastName}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                              {projectUser.profile?.firstName?.[0] ||
                                projectUser.email[0].toUpperCase()}
                            </div>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {projectUser?.profile
                              ? `${projectUser?.profile?.firstName} ${projectUser?.profile?.lastName}`
                              : projectUser?.email}
                            {projectUser?.id === profile?.userId && (
                              <Badge variant="secondary" className="ml-2">
                                You
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {projectUser?.email}
                          </div>
                        </div>
                      </div>

                      {projectUser.id !== profile?.userId && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveUser(projectUser.id)}
                          disabled={removingUserId === projectUser.id}
                          className="text-red-600 hover:text-red-700"
                        >
                          {removingUserId === projectUser.id ? (
                            "Removing..."
                          ) : (
                            <>
                              <X className="h-4 w-4" />
                              Remove
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProjectSettingsModal;
