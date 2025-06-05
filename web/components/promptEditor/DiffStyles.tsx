import { Change } from "diff";
import { ProcessedLine } from "./FullScreenPromptEditor";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { Textarea } from "../ui/textarea";

export const getLineClasses = (type: ProcessedLine["type"]) => {
  switch (type) {
    case "added":
      return "bg-green-50 border-l-2 border-green-500";
    case "removed":
      return "bg-red-50 border-l-2 border-red-500";
    default:
      return "border-l-2 border-transparent";
  }
};

export const renderInlineChanges = (content: string, changes: Change[]) => {
  if (!changes || changes.length === 0) {
    return <span>{content}</span>;
  }

  return (
    <span>
      {changes.map((change, index) => (
        <span
          key={index}
          className={
            change.added
              ? "bg-green-200/50"
              : change.removed
              ? "bg-red-200/50 line-through"
              : ""
          }
        >
          {change.value}
        </span>
      ))}
    </span>
  );
};

interface RenderContentProps {
  isDiffMode: boolean;
  processedDiff: ProcessedLine[];
  promptContent: string;
  setPromptContent: (content: string) => void;
  handleAcceptLine: (index: number) => void;
  handleRejectLine: (index: number) => void;
}

export const renderContent = ({
  isDiffMode,
  processedDiff,
  promptContent,
  setPromptContent,
  handleAcceptLine,
  handleRejectLine,
}: RenderContentProps) => {
  if (isDiffMode && processedDiff.length > 0) {
    // Render diff view
    return (
      <div className="w-full h-full overflow-auto flex">
        {/* Diff line numbers */}
        <div className="bg-gray-50 border-r border-gray-200 px-4 py-4 text-sm text-gray-500 select-none min-w-[60px]">
          {processedDiff.map((line, index) => (
            <div
              key={index}
              className="leading-6 text-right flex items-center gap-2"
            >
              <span className="w-8">
                {line.newLineNumber || line.oldLineNumber || ""}
              </span>
              <span className="w-4 text-center">
                {line.type === "added"
                  ? "+"
                  : line.type === "removed"
                  ? "-"
                  : " "}
              </span>
            </div>
          ))}
        </div>

        {/* Diff content */}
        <div className="flex-1 py-4">
          {processedDiff.map((line, index) => (
            <div
              key={index}
              className={`leading-6 text-sm px-4 ${getLineClasses(
                line.type
              )} flex items-center group`}
            >
              <div className="flex-1">
                <pre className="whitespace-pre-wrap break-words text-gray-800 m-0">
                  {line.wordChanges
                    ? renderInlineChanges(line.content, line.wordChanges)
                    : line.content}
                </pre>
              </div>

              {/* Accept/Reject buttons for all changed lines */}
              {line.type !== "unchanged" && (
                <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => handleAcceptLine(index)}
                    title="Accept this change"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRejectLine(index)}
                    title="Reject this change"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    // Render regular textarea
    return (
      <>
        {/* Line numbers */}
        <div className="bg-gray-50 border-r border-gray-200 px-4 py-4 text-sm text-gray-500 select-none min-w-[60px]">
          {promptContent
            ? promptContent.split("\n").map((_, index) => (
                <div key={index + 1} className="leading-6 text-right">
                  {index + 1}
                </div>
              ))
            : Array.from({ length: 5 }, (_, index) => (
                <div key={index + 1} className="leading-6 text-right">
                  {index + 1}
                </div>
              ))}
        </div>

        {/* Content area */}
        <div className="flex-1 relative overflow-x-auto">
          <div className="min-w-full h-full pr-[14px]">
            <Textarea
              value={promptContent || ""}
              onChange={(e) => setPromptContent(e.target.value)}
              placeholder="Enter your prompt content here..."
              className="w-full h-full border-0 resize-none focus-visible:ring-0 focus:outline-none rounded-none bg-transparent text-sm leading-6 p-4 pr-0"
              style={{
                minHeight: "100%",
                whiteSpace: "pre",
                overflowX: "visible",
                overflowY: "auto",
              }}
            />
          </div>
        </div>
      </>
    );
  }
};
