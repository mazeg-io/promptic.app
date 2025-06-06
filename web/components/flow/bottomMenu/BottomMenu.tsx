import { Hand, MousePointer2 } from "lucide-react";
import React from "react";
import BottomMenuEmojies from "./BottomMenuEmojies";
import createPromptIllustration from "@/public/create_prompt.svg";

interface BottomMenuProps {
  room: any;
  interactionMode: "pointer" | "hand";
  setInteractionMode: (mode: "pointer" | "hand") => void;
  handleCreatePromptNode: () => void;
}

function BottomMenu({
  room,
  interactionMode,
  setInteractionMode,
  handleCreatePromptNode,
}: BottomMenuProps) {
  return (
    <div className="absolute bottom-[12px] left-[50%] -translate-x-1/2 z-[50] flex  border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-lg border max-h-[80px]">
      <div className="flex flex-col border-r border-gray-300 dark:border-gray-600">
        <div
          className={`flex items-center justify-center w-[44px] h-[40px] rounded-tl-lg cursor-pointer transition-colors ${
            interactionMode === "pointer"
              ? "bg-purple-500"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          onClick={() => setInteractionMode("pointer")}
        >
          <MousePointer2
            className={`w-[24px] h-[24px] ${
              interactionMode === "pointer"
                ? "text-white"
                : "text-gray-600 dark:text-gray-300"
            }`}
            strokeWidth={1}
          />
        </div>
        <div
          className={`flex items-center justify-center w-[44px] h-[40px] rounded-bl-lg cursor-pointer transition-colors ${
            interactionMode === "hand"
              ? "bg-purple-500"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          onClick={() => setInteractionMode("hand")}
        >
          <Hand
            className={`w-[24px] h-[24px] ${
              interactionMode === "hand"
                ? "text-white"
                : "text-gray-600 dark:text-gray-300"
            }`}
            strokeWidth={1}
          />
        </div>
      </div>
      <div className={`group max-w-[144px] w-full`}>
        <div className="flex items-center px-[12px] h-full border-r border-gray-300 dark:border-gray-600 cursor-pointer">
          <img
            onClick={handleCreatePromptNode}
            src={createPromptIllustration.src}
            alt="Create a new prompt"
            className="w-[90px] h-[64px] transition-transform duration-300 ease-in-out group-hover:-translate-y-[20px] relative"
          />
        </div>
      </div>
      <div className="flex items-center px-[12px]">
        <BottomMenuEmojies room={room} />
      </div>
    </div>
  );
}

export default BottomMenu;
