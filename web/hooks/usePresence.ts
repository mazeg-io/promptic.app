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

  // Initialize stable values only once, but wait for profile
  if (!stableUserColor.current && profile) {
    const userId = profile.id || profile.email || "anonymous-user";
    stableUserColor.current = generateUserColor(userId);
    console.log(
      "Initialized stable color:",
      stableUserColor.current,
      "for userId:",
      userId
    );
  }

  // Function to get the best available name from profile
  const getBestName = () => {
    if (!profile) return "Anonymous";
    if (profile.firstName) {
      return profile.firstName;
    }
    if (profile.email) {
      return profile.email.split("@")[0];
    }
    return "Anonymous";
  };

  // Update name when profile becomes available
  if (!stableUserName.current && profile) {
    stableUserName.current = getBestName();
    console.log(
      "Initialized stable name:",
      stableUserName.current,
      "from profile:",
      {
        firstName: profile.firstName,
        email: profile.email,
        id: profile.id,
      }
    );
  }

  // Don't initialize presence until we have profile data
  const shouldInitializePresence =
    profile && stableUserColor.current && stableUserName.current;

  // Add user name into cursors and get presence data
  const {
    user: myPresence,
    peers,
    publishPresence,
  } = room.usePresence({
    initialData: shouldInitializePresence
      ? {
          name: stableUserName.current,
          color: stableUserColor.current,
          flowX: 0,
          flowY: 0,
        }
      : {
          name: "Loading...",
          color: "#999999",
          flowX: 0,
          flowY: 0,
        },
  });

  // Update presence when profile loads
  useEffect(() => {
    if (
      profile &&
      (!stableUserName.current || stableUserName.current === "Loading...")
    ) {
      const bestName = getBestName();
      const userId = profile.id || profile.email || "anonymous-user";

      if (!stableUserColor.current) {
        stableUserColor.current = generateUserColor(userId);
      }

      stableUserName.current = bestName;

      publishPresence({
        name: bestName,
        color: stableUserColor.current,
      });

      console.log("Updated presence with profile data:", {
        name: bestName,
        color: stableUserColor.current,
        profile: profile,
      });
    }
  }, [profile, publishPresence]);

  // Add mouse move handler to update presence with flow coordinates
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!stableUserName.current || !stableUserColor.current) return;

      const flowPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Update only position, preserve existing name and color
      publishPresence({
        name: stableUserName.current,
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

  console.log("Current state:", {
    profileLoaded: !!profile,
    stableName: stableUserName.current,
    stableColor: stableUserColor.current,
    shouldInitialize: shouldInitializePresence,
  });

  return {
    peers,
    stableUserColor: stableUserColor.current || "#999999",
    isReady: !!profile && !!stableUserColor.current,
    myPresence,
  };
};
