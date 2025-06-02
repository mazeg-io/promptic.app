import React from "react";

function UserMessage() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="text-sm text-gray-500 font-semibold">You</div>
      <p className="text-sm text-gray-800">
        Hi! How can I help you with 'New prompt'? Hi! How can I help you with
        'New prompt'?
      </p>
    </div>
  );
}

export default UserMessage;
