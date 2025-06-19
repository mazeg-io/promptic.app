import Image from "next/image";
import React, { useMemo, memo, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { db } from "@/instant";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserManagementModal from "@/components/utils/UserManagementModal";
import { useGlobal } from "@/lib/context/GlobalContext";

interface ToolbarOnlineUsersProps {
  room?: any;
}

interface UserAvatarProps {
  user: any;
  isCurrentUser?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = memo(
  ({ user, isCurrentUser = false }) => {
    const displayName = useMemo(
      () => `${user?.name} ${user?.lastName}${isCurrentUser ? " (you)" : ""}`,
      [user?.name, user?.lastName, isCurrentUser]
    );

    const avatarAlt = useMemo(
      () => `${user?.name} ${user?.lastName}`,
      [user?.name, user?.lastName]
    );

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            <Avatar
              className="w-8 h-8 border-2"
              style={{
                borderColor: user?.color || "#6b7280",
              }}
            >
              <Image
                src={user?.profilePicture}
                alt={avatarAlt}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        </TooltipTrigger>
        <TooltipContent>{displayName}</TooltipContent>
      </Tooltip>
    );
  }
);

UserAvatar.displayName = "UserAvatar";

export const ToolbarOnlineUsers = ({ room }: ToolbarOnlineUsersProps) => {
  const { profile } = useGlobal();
  const { user: myPresence, peers: rawPeers } = db.rooms.usePresence(room);

  // Filter peers to show only unique users (deduplicate by userId)
  const peers = useMemo(() => {
    if (!rawPeers || !profile?.userId) return rawPeers;

    const seenUserIds = new Set<string>();
    const filteredPeers: Record<string, any> = {};

    // Add current user to seen set to avoid showing them in peers
    seenUserIds.add(profile.userId);

    Object.entries(rawPeers).forEach(([peerId, peer]: [string, any]) => {
      // Extract userId from peer data
      const peerUserId = peer?.userId;

      // Skip if no userId or already seen this user
      if (!peerUserId || seenUserIds.has(peerUserId)) {
        return;
      }

      // Add this user to seen set and include in filtered peers
      seenUserIds.add(peerUserId);
      filteredPeers[peerId] = peer;
    });

    return filteredPeers;
  }, [rawPeers, profile?.userId]);

  // Memoize the combined users array to prevent unnecessary re-renders
  const allUsers = useMemo(() => {
    const users: { user: any; isCurrentUser: boolean; id: string }[] = [];
    if (myPresence) {
      users.push({ user: myPresence, isCurrentUser: true, id: "current-user" });
    }
    Object.entries(peers).forEach(([peerId, peer]) => {
      users.push({ user: peer, isCurrentUser: false, id: peerId });
    });
    return users;
  }, [myPresence, peers]);

  const onlineCount = allUsers.length;

  // Memoize the visible users to prevent unnecessary slicing
  const visibleUsers = useMemo(() => allUsers.slice(0, 4), [allUsers]);

  // Memoize the overflow count
  const overflowCount = useMemo(
    () => (allUsers.length > 4 ? allUsers.length - 4 : 0),
    [allUsers.length]
  );

  const showLoadingState = room && allUsers.length === 0;
  const [isUserManagementModalOpen, setIsUserManagementModalOpen] =
    useState(false);
  return (
    <>
      {isUserManagementModalOpen && (
        <UserManagementModal
          isOpen={isUserManagementModalOpen}
          onClose={() => setIsUserManagementModalOpen(false)}
        />
      )}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-[2px]">
          {showLoadingState ? (
            <div className="text-xs text-yellow-600 px-2 py-1 bg-yellow-50 rounded">
              Loading...
            </div>
          ) : null}

          {/* Show first 4 users */}
          {visibleUsers.map((userInfo) => (
            <UserAvatar
              key={userInfo.id}
              user={userInfo.user}
              isCurrentUser={userInfo.isCurrentUser}
            />
          ))}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full ml-2"
                onClick={() => setIsUserManagementModalOpen(true)}
              >
                <UserPlus className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Invite user</TooltipContent>
          </Tooltip>

          {/* Show count if more than 4 users */}
          {overflowCount > 0 && (
            <div className="flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full text-xs font-medium">
              +{overflowCount}
            </div>
          )}

          {/* Show online indicator */}
          {room && onlineCount > 0 && (
            <div className="flex items-center gap-1 ml-2 px-2 py-1 bg-green-100 dark:bg-green-900 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                {onlineCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ToolbarOnlineUsers;
