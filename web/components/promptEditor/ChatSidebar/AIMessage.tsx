import { UIMessage } from "ai";
import React from "react";

function AIMessage({ message }: { message: UIMessage }) {
  return (
    <div className="flex flex-col group w-full max-w-[70%] animate-in fade-in duration-500">
      <div className="flex gap-[12px] items-center">
        <div className="flex gap-[6px] flex-col w-fit p-[16px] bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-[8px] min-w-[240px] overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[8px]">
              <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">
                Promptic AI
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-800 dark:text-gray-200">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AIMessage;
