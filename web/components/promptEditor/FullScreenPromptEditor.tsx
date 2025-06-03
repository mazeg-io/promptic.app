"use client";

import React, {
  useState,
  useEffect,
  useRef,
} from "react";
import ChatSidebar from "@/components/promptEditor/ChatSidebar/ChatSidebar";
import { EditingPrompt } from "../flow/FlowCanvas";
import type { Change } from "diff";
import { useFullScreenModalAnimation } from "./helpers/useFullScreenModalAnimation";
import { renderContent } from "./DiffStyles";
import { useDiffFunctions } from "./helpers/useDiffFunctions";

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

  return (
    <div
      ref={modalRef}
      className={`flex w-screen h-screen absolute top-0 left-0 z-[100] bg-white ${
        animationPhase === "opening" && isAnimating ? "shadow-2xl" : ""
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
        className={`flex bg-white overflow-hidden transition-all duration-300 ${
          animationPhase === "open" ? "w-[80%]" : "w-full"
        }`}
        style={{
          opacity: animationPhase === "opening" && isAnimating ? 0.9 : 1,
        }}
      >
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
            onClose={handleClose}
            editingPrompt={promptContent}
            handleDiff={handleDiff}
            handleAcceptAll={handleAcceptAll}
            handleRejectAll={handleRejectAll}
          />
        </div>
      )}
    </div>
  );
};
