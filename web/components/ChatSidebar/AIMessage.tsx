import React from "react";

function AIMessage() {
  return (
    <div className="flex flex-col gap-[4px] w-full">
      <div className="flex-1">
        <div className="text-sm text-gray-500 font-semibold">Promptic AI</div>
      </div>
      <p className="text-sm text-gray-800">
        Hi! How can I help you with 'New prompt'? Hi! How can I help you with
        'New prompt'?
      </p>
    </div>
  );
}

export default AIMessage;
