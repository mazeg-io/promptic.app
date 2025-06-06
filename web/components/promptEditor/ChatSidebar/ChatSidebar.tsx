import { Button } from "@/components/ui/button";
import { Bot, Loader2, Send, X } from "lucide-react";
import React, { useEffect } from "react";
import AIMessage from "./AIMessage";
import UserMessage from "./UserMessage";
import { useChat } from "@ai-sdk/react";
import { promptic_system_prompt } from "./prompts/promptic_system_prompt";

function ChatSidebar({
  onClose,
  editingPrompt,
  handleDiff,
  handleAcceptAll,
  handleRejectAll,
  width = 320,
  onResizeStart,
  isResizing = false,
  isDiffMode,
}: {
  onClose: () => void;
  editingPrompt: string | null;
  handleDiff: (newPrompt: string) => void;
  handleAcceptAll: () => void;
  handleRejectAll: () => void;
  width?: number;
  onResizeStart?: (e: React.MouseEvent) => void;
  isResizing?: boolean;
  isDiffMode?: boolean;
}) {
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
  };

  const handleRejectAllClick = () => {
    handleRejectAll();
  };

  return (
    <div
      className="fixed top-0 right-0 bg-white dark:bg-gray-800 border-l h-full border-gray-200 dark:border-gray-700 flex flex-col"
      style={{ width: `${width}px` }}
    >
      {/* Resize handle */}
      {onResizeStart && (
        <div
          className={`absolute left-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-500 hover:bg-opacity-50 transition-colors ${
            isResizing ? "bg-blue-500 bg-opacity-50" : ""
          }`}
          onMouseDown={onResizeStart}
          style={{ left: "-2px", width: "4px" }}
        />
      )}

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
      <div className="py-4 px-[16px] h-full flex flex-col gap-4 overflow-y-auto">
        {messages.map((message, index) =>
          message.role !== "system" ? (
            <div key={message.id}>
              {message.parts &&
                message.parts.some((part) => part.type === "tool-invocation") &&
                (() => {
                  const toolInvocations = message.parts.filter(
                    (part) => part.type === "tool-invocation"
                  )[0]?.toolInvocation;
                  const isLastMessage = index === messages.length - 1;
                  return (
                    <>
                      {toolInvocations.toolName === "prompt_write" && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 max-w-[70%]">
                          <p className="text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-md p-2 font-semibold bg-white dark:bg-gray-800">
                            Prompt Updated
                          </p>
                          <div className="flex items-center gap-2 mt-[6px]">
                            {isDiffMode && isLastMessage && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleAcceptAllClick}
                                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  Accept All
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleRejectAllClick}
                                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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
              {message.role === "user" && <UserMessage message={message} />}
              {message.role === "assistant" && message.parts.length === 1 && (
                <AIMessage message={message} />
              )}
            </div>
          ) : null
        )}
        {status === "streaming" && (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Thinking...
            </p>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-end gap-[12px] bg-gray-50 dark:bg-gray-700 rounded-xl p-3 border border-gray-200 dark:border-gray-600">
          <textarea
            placeholder="Type your message here..."
            value={input}
            onChange={(e) =>
              handleInputChange({ target: { value: e.target.value } } as any)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            className="flex-1 resize-none bg-transparent border-none outline-none text-sm placeholder-gray-500 dark:placeholder-gray-400 min-h-[2.5rem] max-h-[130px] overflow-y-auto"
            rows={3}
          />
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!input.trim() || status === "streaming"}
            className="bg-gray-900 rounded-full hover:bg-gray-800 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed w-[36px] h-[36px]"
          >
            <Send className="!h-[14px] !w-[14px] text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatSidebar;
