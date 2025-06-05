import { UIMessage } from "ai";
import React from "react";

function UserMessage({ message }: { message: UIMessage }) {
  return (
    <div className="flex flex-col w-fit p-[16px] bg-gray-50 dark:bg-gray-100 border border-gray-300 dark:border-gray-600 rounded-[8px] max-w-[70%] min-w-[200px] group animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-bold text-gray-900 dark:text-gray-700">
          User
        </p>
      </div>
      <div
        className="mt-[4px] text-sm font-medium text-gray-800 dark:text-gray-800 overflow-hidden"
        style={{
          wordBreak: "break-word",
        }}
      >
        {message.content}
      </div>
    </div>
  );
}

export default UserMessage;
