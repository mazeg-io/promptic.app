import { Button } from "@/components/ui/button";
import { Bot, Loader2, Send, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import AIMessage from "./AIMessage";
import UserMessage from "./UserMessage";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { promptic_system_prompt } from "./prompts/promptic_system_prompt";

function ChatSidebar({
  onClose,
  editingPrompt,
  handleDiff,
  handleAcceptAll,
  handleRejectAll,
}: {
  onClose: () => void;
  editingPrompt: string | null;
  handleDiff: (newPrompt: string) => void;
  handleAcceptAll: () => void;
  handleRejectAll: () => void;
}) {
  const [buttonsVisible, setButtonsVisible] = useState(true);

  const { messages, input, handleInputChange, status, handleSubmit } = useChat({
    initialMessages: [
      {
        id: "system",
        role: "system",
        content: promptic_system_prompt(editingPrompt ?? ""),
      },
      {
        id: "assistant-initial",
        role: "assistant",
        content: "Hello, I'm Promptic AI. How can I help you today?",
      },
    ],
  });

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage.role === "assistant" &&
      lastMessage.parts?.some((part) => part.type === "tool-invocation")
    ) {
      const tool = lastMessage.parts.filter(
        (part) => part.type === "tool-invocation"
      )[0]?.toolInvocation;
      if (tool?.toolName === "prompt_write") {
        handleDiff(tool.args.prompt);
      }
    }
  }, [messages]);

  const handleAcceptAllClick = () => {
    handleAcceptAll();
    setButtonsVisible(false);
  };

  const handleRejectAllClick = () => {
    handleRejectAll();
    setButtonsVisible(false);
  };

  return (
    <div className="w-[20%] fixed top-0 right-0 bg-white dark:bg-gray-800 border-l h-full border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Bot className="h-5 w-5 flex-shrink-0" />
            <h2 className="text-lg font-semibold truncate">Chat</h2>
          </div>
          <Button onClick={onClose} variant="ghost" size="icon">
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
                          Prompt Updated
                        </p>
                        <div className="flex items-center gap-2 mt-[6px]">
                          {buttonsVisible && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleAcceptAllClick}
                              >
                                Accept All
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRejectAllClick}
                              >
                                Reject All
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
          </div>
        ))}
        {status === "streaming" && (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-sm text-gray-500">Thinking...</p>
          </div>
        )}
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
