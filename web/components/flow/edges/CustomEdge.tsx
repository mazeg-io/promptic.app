"use client";

import React from "react";
import { EdgeProps, getBezierPath } from "@xyflow/react";

export const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path stroke-2 stroke-gray-400 hover:stroke-blue-500 transition-colors"
        d={edgePath}
        markerEnd={markerEnd}
      />
    </>
  );
};
