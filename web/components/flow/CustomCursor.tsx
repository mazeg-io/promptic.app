"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";

interface CustomCursorProps {
  color?: string;
  name: string;
}

export function CustomCursor({ color, name }: CustomCursorProps) {
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
