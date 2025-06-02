import { Button } from "@/components/ui/button";
import { Bot, Send, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import AIMessage from "./AIMessage";
import UserMessage from "./UserMessage";
import { Input } from "../ui/input";
import { useChat } from "@ai-sdk/react";

function ChatSidebar({
  isOpen,
  setIsOpen,
  editingPrompt,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingPrompt: string | null;
}) {
  const current_prompt = `
  You are proffesional prompt writer. You are given a prompt and you need to rewrite it to make it more accurate and detailed.

  Current prompt you are working on:
  ${editingPrompt}
  `;

  useEffect(() => {
    console.log("editingPrompt", editingPrompt);
  }, [editingPrompt]);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      {
        id: "system",
        role: "system",
        content: current_prompt,
      },
      {
        id: "assistant-initial",
        role: "assistant",
        content: "Hello, I'm Promptic AI. How can I help you today?",
      },
    ],
  });

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
      <div className="py-4 px-6 h-full flex flex-col gap-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id}>
            {message.role === "user" && <UserMessage message={message} />}
            {message.role === "assistant" && <AIMessage message={message} />}
            {message.parts &&
              message.parts.some((part) => part.type === "tool-invocation") &&
              (() => {
                const toolInvocations = message.parts.filter(
                  (part) => part.type === "tool-invocation"
                )[0]?.toolInvocation;
                return (
                  <>
                    {toolInvocations.toolName === "prompt_write" && (
                      <div>
                        <p className="text-xs text-gray-500 border border-gray-200 rounded-md p-2 font-semibold">
                          {toolInvocations.args.prompt}
                        </p>
                      </div>
                    )}
                  </>
                );
              })()}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <Input
          placeholder="Type your message here..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
        <Button size="icon" onClick={handleSubmit}>
          <Send />
        </Button>
      </div>
    </div>
  );
}

export default ChatSidebar;
