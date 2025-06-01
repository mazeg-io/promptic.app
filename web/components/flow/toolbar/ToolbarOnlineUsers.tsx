import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/instant";
import { useGlobal } from "@/lib/context/GlobalContext";

interface ToolbarOnlineUsersProps {
  room?: any;
}

const ToolbarOnlineUsers: React.FC<ToolbarOnlineUsersProps> = ({ room }) => {
  const { profile } = useGlobal();

  // Use presence specifically for user profiles (separate from cursors)
  const {
    user: myPresence,
    peers,
    publishPresence,
  } = db.rooms.usePresence(room);

  // Update presence when profile changes
  useEffect(() => {
    if (room && profile && publishPresence) {
      publishPresence({
        userId: profile.userId,
        firstName: profile.firstName,
        lastName: profile.lastName,
        profilePicture: profile.profilePicture || "",
        email: profile.email,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        joinedAt: Date.now(),
      });
    }
  }, [profile, room, publishPresence]);

  const onlineCount = Object.keys(peers).length + (myPresence ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-[4px]">
        {/* Show current user */}
        {myPresence ? (
          <div
            className="relative"
            title={`${(myPresence as any)?.firstName} ${
              (myPresence as any)?.lastName
            } (you)`}
          >
            <Avatar
              className="w-8 h-8 border-2"
              style={{
                borderColor: (myPresence as any)?.color || "#3b82f6",
              }}
            >
              <AvatarImage
                src={(myPresence as any)?.profilePicture || ""}
                alt={`${(myPresence as any)?.firstName} ${
                  (myPresence as any)?.lastName
                }`}
                onError={(e) => {
                  console.log(
                    "Avatar image failed to load:",
                    (myPresence as any)?.profilePicture
                  );
                }}
              />
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        ) : room ? (
          <div className="text-xs text-yellow-600 px-2 py-1 bg-yellow-50 rounded">
            Loading presence...
          </div>
        ) : null}

        {/* Show other online users */}
        {Object.entries(peers)
          .slice(0, 3)
          .map(([peerId, peer]) => (
            <div
              key={peerId}
              className="relative"
              title={`${(peer as any)?.firstName} ${(peer as any)?.lastName}`}
            >
              <Avatar
                className="w-8 h-8 border-2"
                style={{ borderColor: (peer as any)?.color || "#6b7280" }}
              >
                <AvatarImage
                  src={(peer as any)?.profilePicture || ""}
                  alt={`${(peer as any)?.firstName} ${(peer as any)?.lastName}`}
                  onError={(e) => {
                    console.log(
                      "Peer avatar image failed to load:",
                      (peer as any)?.profilePicture
                    );
                  }}
                />
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
          ))}

        {/* Show count if more than 3 users */}
        {Object.keys(peers).length > 3 && (
          <div className="flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full text-xs font-medium">
            +{Object.keys(peers).length - 3}
          </div>
        )}

        {/* Show online indicator */}
        {room && onlineCount > 0 && (
          <div className="flex items-center gap-1 ml-2 px-2 py-1 bg-green-100 dark:bg-green-900 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-700 dark:text-green-300 font-medium">
              {onlineCount} online
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolbarOnlineUsers;
