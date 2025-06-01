"use client";

import { useEffect, useRef } from "react";
import { useReactFlow } from "@xyflow/react";
import { useGlobal } from "@/lib/context/GlobalContext";

const generateUserColor = (userId: string) => {
  // Generate a consistent color based on user ID
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 45%)`;
};

interface PresenceData {
  name?: string;
  color?: string;
  profilePicture?: string;
  flowX?: number;
  flowY?: number;
  screenX?: number;
  screenY?: number;
}

interface UsePresenceReturn {
  peers: Record<string, PresenceData>;
  stableUserColor: string;
  isReady: boolean;
  myPresence: PresenceData;
}

export const usePresence = (room: any): UsePresenceReturn => {
  const { profile } = useGlobal();
  const { screenToFlowPosition } = useReactFlow();

  // Use refs to store stable values that don't cause re-renders
  const stableUserColor = useRef<string | null>(null);
  const stableUserName = useRef<string | null>(null);
  const stableUserLastName = useRef<string | null>(null);
  const stableUserProfilePicture = useRef<string | null>(null);
  const hasPublishedInitialPresence = useRef<boolean>(false);

  // Add user name into cursors and get presence data
  const { user: myPresence, peers, publishPresence } = room.usePresence({});

  // Update presence when profile loads or changes
  useEffect(() => {
    if (profile) {
      const name = profile.firstName || "No name";
      const lastName = profile.lastName || "";
      const userId = profile.userId;
      const profilePicture = profile?.profilePicture || null;

      // Initialize stable values if not already set
      if (!stableUserColor.current) {
        stableUserColor.current = generateUserColor(userId);
      }

      // Update stable values
      stableUserName.current = name;
      stableUserLastName.current = lastName;
      stableUserProfilePicture.current = profilePicture;

      // Always publish presence when profile is available
      publishPresence({
        name: name,
        lastName: lastName,
        color: stableUserColor.current,
        profilePicture: profilePicture || undefined,
      });

      hasPublishedInitialPresence.current = true;
    }
  }, [profile, publishPresence]);

  // Add mouse move handler to update presence with flow coordinates
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (
        !stableUserName.current ||
        !stableUserColor.current ||
        !hasPublishedInitialPresence.current
      )
        return;

      const flowPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Update only position, preserve existing name, color and profile picture
      publishPresence({
        name: stableUserName.current,
        lastName: stableUserLastName.current,
        profilePicture: stableUserProfilePicture.current || undefined,
        color: stableUserColor.current,
        flowX: flowPosition.x,
        flowY: flowPosition.y,
        screenX: event.clientX,
        screenY: event.clientY,
      });
    };

    // Add event listener to the document
    document.addEventListener("mousemove", handleMouseMove);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [screenToFlowPosition, publishPresence]);

  return {
    peers,
    stableUserColor: stableUserColor.current || "#999999",
    isReady:
      !!profile &&
      !!stableUserColor.current &&
      hasPublishedInitialPresence.current,
    myPresence,
  };
};
