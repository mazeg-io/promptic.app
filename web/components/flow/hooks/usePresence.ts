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

  // Initialize stable values only once, but wait for profile
  if (!stableUserColor.current && profile) {
    const userId = profile.userId;
    stableUserColor.current = generateUserColor(userId);
    stableUserName.current = profile.firstName || "No name";
    stableUserLastName.current = profile.lastName || "";
    stableUserProfilePicture.current = profile?.profilePicture || null;
  }

  // Add user name into cursors and get presence data
  const { user: myPresence, peers, publishPresence } = room.usePresence({});

  // Update presence when profile loads
  useEffect(() => {
    if (profile && !stableUserName.current) {
      const name = profile.firstName || "No name";
      const lastName = profile.lastName || "";
      const userId = profile.userId;
      if (!stableUserColor.current) {
        stableUserColor.current = generateUserColor(userId);
      }
      stableUserName.current = name;
      stableUserLastName.current = lastName;
      publishPresence({
        name: name,
        lastName: lastName,
        color: stableUserColor.current,
        profilePicture: profile?.profilePicture || undefined,
      });
    }
  }, [profile]);

  // Add mouse move handler to update presence with flow coordinates
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!stableUserName.current || !stableUserColor.current) return;

      const flowPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Update only position, preserve existing name, color and profile picture
      publishPresence({
        name: stableUserName.current,
        lastName: stableUserLastName.current,
        profilePicture: profile?.profilePicture || undefined,
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
  }, []);

  return {
    peers,
    stableUserColor: stableUserColor.current || "#999999",
    isReady: !!profile && !!stableUserColor.current,
    myPresence,
  };
};
