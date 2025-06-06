import { Change } from "diff";
import { ProcessedLine } from "./FullScreenPromptEditor";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useRef, useEffect, useState } from "react";

export const getLineClasses = (type: ProcessedLine["type"]) => {
  switch (type) {
    case "added":
      return "bg-green-50 dark:bg-green-900/20 border-l-2 border-green-500 dark:border-green-400";
    case "removed":
      return "bg-red-50 dark:bg-red-900/20 border-l-2 border-red-500 dark:border-red-400";
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
              ? "bg-green-200/50 dark:bg-green-400/20"
              : change.removed
              ? "bg-red-200/50 dark:bg-red-400/20 line-through"
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
  handlePromptChange: (content: string) => void;
}

export const renderContent = ({
  isDiffMode,
  processedDiff,
  promptContent,
  setPromptContent,
  handlePromptChange,
  handleAcceptLine,
  handleRejectLine,
}: RenderContentProps) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const parentRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [hasScroll, setHasScroll] = useState(false);

  // I need this for border of line numbers
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const checkScroll = () => {
      if (parentRef.current) {
        const hasVerticalScroll =
          parentRef.current.scrollHeight > parentRef.current.clientHeight;
        setHasScroll(hasVerticalScroll);
      }
    };

    checkScroll();

    // Check on resize
    const resizeObserver = new ResizeObserver(checkScroll);
    if (parentRef.current) {
      resizeObserver.observe(parentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [processedDiff, promptContent]);

  if (isDiffMode && processedDiff.length > 0) {
    // Render diff view
    return (
      <div ref={parentRef} className="w-full h-full overflow-auto flex">
        {/* Diff line numbers */}
        <div
          ref={lineNumbersRef}
          className="dark:border-gray-700 px-4 py-4 border-r border-gray-200  text-sm text-gray-500 dark:text-gray-400 select-none min-w-[60px]"
          style={{ height: hasScroll ? "auto" : "fit-content" }}
        >
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
                <pre className="whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200 m-0">
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
                    className="h-6 w-6 p-0 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                    onClick={() => handleAcceptLine(index)}
                    title="Accept this change"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
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
    // Calculate the number of lines to ensure line numbers match content
    const lines = promptContent ? promptContent.split("\n") : [""];
    const lineCount = Math.max(lines.length, 20); // Minimum 20 lines for better UX

    // Render regular textarea with wrapper scroll
    return (
      <div ref={parentRef} className="w-full h-full overflow-auto flex">
        {/* Line numbers */}
        <div
          ref={lineNumbersRef}
          className="border-r border-gray-200 dark:border-gray-700 select-none min-w-[60px] flex-shrink-0"
          style={{
            paddingTop: "16px",
            paddingBottom: "16px",
            paddingLeft: "16px",
            paddingRight: "16px",
            color: "#6b7280", // gray-500 equivalent
            height: hasScroll ? "fit-content" : "auto",
          }}
        >
          {Array.from({ length: lineCount }, (_, index) => (
            <div
              key={index + 1}
              className="text-right"
              style={{
                lineHeight: "24px",
                height: "24px",
                fontSize: "14px",
                color: "inherit",
              }}
            >
              {index + 1}
            </div>
          ))}
        </div>

        {/* Content area */}
        <div className="flex-1 relative">
          <Textarea
            value={promptContent || ""}
            onChange={(e) => setPromptContent(e.target.value)}
            placeholder="Enter your prompt content here..."
            className="w-full border-0  !bg-transparent border-gray-200 dark:border-gray-700 resize-none focus-visible:ring-0 focus:outline-none rounded-none text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            style={{
              height: `${lineCount * 24 + 32}px`, // 24px per line + 32px padding (16px top + 16px bottom)
              whiteSpace: "pre",
              overflow: "hidden",
              fontSize: "14px",
              lineHeight: "24px",
              paddingTop: "16px",
              paddingBottom: "16px",
              paddingLeft: "16px",
              paddingRight: "16px",
            }}
          />
        </div>
      </div>
    );
  }
};
