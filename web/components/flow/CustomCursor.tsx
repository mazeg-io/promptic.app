"use client";

import React from "react";
import { useReactFlow } from "@xyflow/react";

interface CustomCursorProps {
  color?: string;
  name: string;
}

interface PresenceData {
  name?: string;
  color?: string;
  flowX?: number;
  flowY?: number;
  screenX?: number;
  screenY?: number;
}

interface CustomCursorContainerProps {
  peers: Record<string, PresenceData>;
  reactFlowWrapper: React.RefObject<HTMLDivElement | null>;
  stableUserColor: string;
}

export function CursorPointer({ color, name }: CustomCursorProps) {
  return (
    <div className="pointer-events-none relative">
      {/* Cursor pointer */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="absolute -top-1 -left-1"
      >
        <path
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
          fill={color ?? "#3b82f6"}
          stroke="white"
          strokeWidth="1"
        />
      </svg>
      {/* Name label */}
      <span
        className={`absolute top-5 left-2 rounded-b-xl rounded-r-xl border-2 bg-white/90 px-3 py-1 text-xs font-medium shadow-lg backdrop-blur-md dark:bg-gray-800/90 dark:text-white transition-all duration-200`}
        style={{
          borderColor: color ?? "#3b82f6",
        }}
      >
        {name}
      </span>
    </div>
  );
}

export const CustomCursor = ({
  peers,
  reactFlowWrapper,
  stableUserColor,
}: CustomCursorContainerProps) => {
  const reactFlowInstance = useReactFlow();

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Object.entries(peers).map(([peerId, presence]) => {
        if (!presence.flowX || !presence.flowY) return null;

        console.log(
          "Rendering cursor for peer:",
          peerId,
          "presence:",
          presence
        );

        // Get the ReactFlow viewport to calculate cursor positions
        const viewport = reactFlowInstance.getViewport();
        const containerRect = reactFlowWrapper.current?.getBoundingClientRect();

        if (!containerRect) return null;

        // Convert flow coordinates to screen coordinates within the viewport
        const screenX = presence.flowX * viewport.zoom + viewport.x;
        const screenY = presence.flowY * viewport.zoom + viewport.y;

        const arrowSize = 12;
        const edgeMargin = 8;

        // Check if cursor is outside viewport bounds
        const isOutsideLeft = screenX < 0;
        const isOutsideRight = screenX > containerRect.width;
        const isOutsideTop = screenY < 0;
        const isOutsideBottom = screenY > containerRect.height;
        const isOutside =
          isOutsideLeft || isOutsideRight || isOutsideTop || isOutsideBottom;

        if (isOutside) {
          // Calculate arrow position at corners/edges
          let arrowX, arrowY, rotation;

          if (isOutsideLeft && isOutsideTop) {
            // Top-left corner
            arrowX = edgeMargin;
            arrowY = edgeMargin;
            rotation = 315; // Point up-left
          } else if (isOutsideRight && isOutsideTop) {
            // Top-right corner
            arrowX = containerRect.width - edgeMargin - arrowSize;
            arrowY = edgeMargin;
            rotation = 45; // Point up-right
          } else if (isOutsideLeft && isOutsideBottom) {
            // Bottom-left corner
            arrowX = edgeMargin;
            arrowY = containerRect.height - edgeMargin - arrowSize;
            rotation = 225; // Point down-left
          } else if (isOutsideRight && isOutsideBottom) {
            // Bottom-right corner
            arrowX = containerRect.width - edgeMargin - arrowSize;
            arrowY = containerRect.height - edgeMargin - arrowSize;
            rotation = 135; // Point down-right
          } else if (isOutsideLeft) {
            // Left edge
            arrowX = edgeMargin;
            arrowY = Math.max(
              edgeMargin,
              Math.min(
                screenY - arrowSize / 2,
                containerRect.height - edgeMargin - arrowSize
              )
            );
            rotation = 270; // Point left
          } else if (isOutsideRight) {
            // Right edge
            arrowX = containerRect.width - edgeMargin - arrowSize;
            arrowY = Math.max(
              edgeMargin,
              Math.min(
                screenY - arrowSize / 2,
                containerRect.height - edgeMargin - arrowSize
              )
            );
            rotation = 90; // Point right
          } else if (isOutsideTop) {
            // Top edge
            arrowX = Math.max(
              edgeMargin,
              Math.min(
                screenX - arrowSize / 2,
                containerRect.width - edgeMargin - arrowSize
              )
            );
            arrowY = edgeMargin;
            rotation = 0; // Point up
          } else if (isOutsideBottom) {
            // Bottom edge
            arrowX = Math.max(
              edgeMargin,
              Math.min(
                screenX - arrowSize / 2,
                containerRect.width - edgeMargin - arrowSize
              )
            );
            arrowY = containerRect.height - edgeMargin - arrowSize;
            rotation = 180; // Point down
          }

          return (
            <div
              key={peerId}
              className="absolute z-50"
              style={{
                left: arrowX,
                top: arrowY,
                width: arrowSize,
                height: arrowSize,
                transform: `rotate(${rotation}deg)`,
              }}
            >
              <svg
                width={arrowSize}
                height={arrowSize}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 2L20 10L16 10L16 22L8 22L8 10L4 10L12 2Z"
                  fill={presence.color || stableUserColor}
                />
              </svg>
            </div>
          );
        } else {
          // Cursor is within viewport - show normal cursor
          return (
            <div
              key={peerId}
              className="absolute z-50"
              style={{
                left: screenX,
                top: screenY,
                transform: "translate(-50%, -50%)",
              }}
            >
              <CursorPointer
                color={presence.color || stableUserColor}
                name={presence.name || "Anonymous"}
              />
            </div>
          );
        }
      })}
    </div>
  );
};
