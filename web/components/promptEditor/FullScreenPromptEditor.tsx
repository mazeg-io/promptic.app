"use client";

import React, { useState, useEffect, useRef } from "react";
import ChatSidebar from "@/components/promptEditor/ChatSidebar/ChatSidebar";
import { EditingPrompt } from "../flow/FlowCanvas";
import type { Change } from "diff";
import { useFullScreenModalAnimation } from "./helpers/useFullScreenModalAnimation";
import { renderContent } from "./DiffStyles";
import { useDiffFunctions } from "./helpers/useDiffFunctions";
import { useResizableSidebar } from "./helpers/useResizableSidebar";
import { Button } from "@/components/ui/button";

export interface ProcessedLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
  wordChanges?: Change[];
}

interface FullScreenPromptEditorProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: EditingPrompt;
}

export const FullScreenPromptEditor: React.FC<FullScreenPromptEditorProps> = ({
  isOpen,
  onClose,
  prompt,
}) => {
  const [promptContent, setPromptContent] = useState<string | null>(null);
  const [isDiffMode, setIsDiffMode] = useState(false);
  const [originalContent, setOriginalContent] = useState<string>("");
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Resizable sidebar hook
  const { sidebarWidth, isResizing, startResize } = useResizableSidebar({
    initialWidth: 500,
    minWidth: 280,
    maxWidth: 1000,
  });

  // Sidebar animation hook
  const { isAnimating, animationPhase, sidebarOpacity, handleClose } =
    useFullScreenModalAnimation({
      isOpen,
      prompt,
      onClose,
      modalRef,
    });

  useEffect(() => {
    if (prompt.prompt) {
      setPromptContent(prompt.prompt);
      setOriginalContent(prompt.prompt);
    }
  }, [prompt?.prompt]);

  // Handle Hotkeys for modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown, true); // Use capture phase
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isOpen, handleClose]);

  const {
    processedDiff,
    handleRejectLine,
    handleAcceptLine,
    handleDiff,
    handleAcceptAll,
    handleRejectAll,
  } = useDiffFunctions({
    promptContent,
    setPromptContent,
    originalContent,
    isDiffMode,
    setIsDiffMode,
    setOriginalContent,
  });

  // Calculate main content width based on sidebar width and animation phase
  const mainContentWidth =
    animationPhase === "open" ? `calc(100% - ${sidebarWidth}px)` : "100%";

  return (
    <div
      ref={modalRef}
      className={`flex w-screen h-screen absolute top-0 left-0 z-[100] bg-white dark:bg-gray-900 ${
        animationPhase === "opening" && isAnimating
          ? "shadow-2xl dark:shadow-gray-800/50"
          : ""
      }`}
      style={{
        ...(animationPhase === "opening" && isAnimating
          ? {
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }
          : {}),
      }}
    >
      {/* Main content area */}
      <div
        className="flex bg-white dark:bg-gray-900 overflow-hidden transition-all duration-300"
        style={{
          width: mainContentWidth,
          opacity: animationPhase === "opening" && isAnimating ? 0.9 : 1,
        }}
      >
        {isDiffMode && (
          <div className="absolute bottom-[32px] right-[50%] dark:bg-gray-800 bg-gray-600 shadow-lg px-[12px] py-[6px] rounded-[12px] flex gap-[12px] w-fit">
            <Button variant="outline" size="sm" onClick={handleRejectAll}>
              Reject All
            </Button>
            <Button variant="outline" size="sm" onClick={handleAcceptAll}>
              Accept All
            </Button>
          </div>
        )}
        {renderContent({
          isDiffMode,
          processedDiff,
          promptContent: promptContent ?? "",
          setPromptContent,
          handleAcceptLine,
          handleRejectLine,
        })}
      </div>

      {/* Chat sidebar - show during opening and open phases with opacity animation */}
      {(animationPhase === "opening" || animationPhase === "open") && (
        <div
          className="transition-opacity duration-300 ease-out"
          style={{ opacity: sidebarOpacity }}
        >
          <ChatSidebar
            isDiffMode={isDiffMode}
            onClose={handleClose}
            editingPrompt={promptContent}
            handleDiff={handleDiff}
            handleAcceptAll={handleAcceptAll}
            handleRejectAll={handleRejectAll}
            width={sidebarWidth}
            onResizeStart={startResize}
            isResizing={isResizing}
          />
        </div>
      )}
    </div>
  );
};
