import { Button } from "@/components/ui/button";
import { Bot, Send, X } from "lucide-react";
import React from "react";
import AIMessage from "./AIMessage";
import UserMessage from "./UserMessage";
import { Input } from "../ui/input";

function ChatSidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="w-[400px] fixed top-0 right-0 bg-white dark:bg-gray-800 border-l h-full border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Bot className="h-5 w-5 flex-shrink-0" />
            <h2 className="text-lg font-semibold truncate">Chat</h2>
          </div>
          <Button onClick={() => setIsOpen(false)} variant="ghost" size="icon">
            <X />
          </Button>
        </div>
      </div>
      <div className="py-4 px-6 flex flex-col gap-4 overflow-y-auto">
        {[
          1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
          2, 2, 2, 2, 2,
        ].map((item) => (
          <>
            <AIMessage />
            <UserMessage />
            <AIMessage />
            <UserMessage />
          </>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <Input placeholder="Type your message here..." />
        <Button size="icon">
          <Send />
        </Button>
      </div>
    </div>
  );
}

export default ChatSidebar;
