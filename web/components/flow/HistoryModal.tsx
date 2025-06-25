import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { db } from "@/instant";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar } from "../ui/avatar";
import { Clock, User } from "lucide-react";

function HistoryModal({
  isOpen,
  onClose,
  promptId,
}: {
  isOpen: boolean;
  onClose: () => void;
  promptId: string;
}) {
  // Query all versions for this prompt
  const {
    data: versionsData,
    error,
    isLoading,
  } = db.useQuery(
    promptId
      ? {
          prompt_versions: {
            $: {
              order: {
                versionNumber: "desc",
              },
              where: {
                promptId: promptId,
              },
            },
            $user: {
              profile: {},
            },
          },
        }
      : null
  );

  useEffect(() => {
    console.log("errrooor", error);
  }, [error]);

  useEffect(() => {
    console.log("444", versionsData);
  }, [versionsData]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getContentPreview = (content: string) => {
    if (content.length <= 100) return content;
    return content.substring(0, 100) + "...";
  };

  const versions = versionsData?.prompt_versions || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[70%]">
        <DialogHeader>
          <DialogTitle>
            {versionsData && versionsData.prompt_versions.length > 0
              ? `${versionsData.prompt_versions[0].name} - History`
              : "Prompt History"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
          {versions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No version history available for this prompt.</p>
              <p className="text-sm mt-2">
                Version history will appear here after you publish changes.
              </p>
            </div>
          ) : (
            versions.map((version, index) => {
              const user = version.$user?.profile;
              const isLatest = index === 0;

              return (
                <Card
                  key={version.id}
                  className={`
                    !gap-[6px]
                    ${isLatest ? "border-2 border-blue-500" : ""}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant={isLatest ? "default" : "secondary"}>
                          v{version.versionNumber}
                          {isLatest && " (Latest)"}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          {formatDate(version.createdAt)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {user && (
                          <>
                            <Avatar className="w-6 h-6">
                              {user.profilePicture ? (
                                <img
                                  src={user.profilePicture}
                                  alt={`${user.firstName} ${user.lastName}`}
                                  className="w-6 h-6 rounded-full"
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
                                <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                  <User className="w-3 h-3" />
                                </div>
                              )}
                            </Avatar>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {user.firstName} {user.lastName}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    {version.changeDescription && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {version.changeDescription}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                          Content Preview
                        </h4>
                        <div className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">
                          <pre className="whitespace-pre-wrap font-mono text-xs">
                            {getContentPreview(version.content)}
                          </pre>
                        </div>
                      </div>
                      {version.variables && (
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                            Variables
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {version.variables
                              .split(", ")
                              .filter(
                                (variable: string) => variable.trim().length > 0
                              )
                              .map((variable: string, idx: number) => (
                                <Badge
                                  variant="outline"
                                  key={idx}
                                  className="text-xs bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                                >
                                  {variable}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default HistoryModal;
