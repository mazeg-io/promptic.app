import { UIMessage } from "ai";
import React from "react";

function UserMessage({ message }: { message: UIMessage }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="text-sm text-gray-500 font-semibold">You</div>
      <p className="text-sm text-gray-800">{message.content}</p>
    </div>
  );
}

export default UserMessage;
