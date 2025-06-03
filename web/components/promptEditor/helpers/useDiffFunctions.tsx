import { diffLines, diffWordsWithSpace } from "diff";
import { useMemo } from "react";
import { ProcessedLine } from "../FullScreenPromptEditor";

export const useDiffFunctions = ({
  promptContent,
  setPromptContent,
  originalContent,
  isDiffMode,
  setIsDiffMode,
  setOriginalContent,
}: {
  promptContent: string | null;
  setPromptContent: (content: string) => void;
  originalContent: string;
  isDiffMode: boolean;
  setIsDiffMode: (isDiffMode: boolean) => void;
  setOriginalContent: (content: string) => void;
}) => {
  const handleRejectLine = (lineIndex: number) => {
    const line = processedDiff[lineIndex];
    let finalPromptContent = promptContent || "";

    if (line.type === "added") {
      // Reject the added line - remove it from current content and keep original as is
      const currentLines = (promptContent || "").split("\n");
      const lineToRemove = line.content;
      const indexToRemove = currentLines.findIndex((l) => l === lineToRemove);

      if (indexToRemove !== -1) {
        currentLines.splice(indexToRemove, 1);
        finalPromptContent = currentLines.join("\n");
        setPromptContent(finalPromptContent);
      }
    } else if (line.type === "removed") {
      // Reject the removal - add the line back to current content
      const currentLines = (promptContent || "").split("\n");
      const originalLines = originalContent.split("\n");

      // Find where this line was in the original content
      const originalIndex = originalLines.findIndex((l) => l === line.content);

      if (originalIndex !== -1) {
        // Insert at the correct position in current content
        let insertPosition = 0;
        for (let i = 0; i < originalIndex; i++) {
          const originalLine = originalLines[i];
          const currentIndex = currentLines.findIndex(
            (l) => l === originalLine
          );
          if (currentIndex !== -1) {
            insertPosition = currentIndex + 1;
          }
        }

        currentLines.splice(insertPosition, 0, line.content);
        finalPromptContent = currentLines.join("\n");
        setPromptContent(finalPromptContent);
      }
    }

    // Check if all changes have been processed and exit diff mode if so
    checkAndExitDiffMode(originalContent, finalPromptContent);
  };

  const handleAcceptLine = (lineIndex: number) => {
    const line = processedDiff[lineIndex];
    let updatedOriginalContent = originalContent;
    let updatedCurrentContent = promptContent || "";

    if (line.type === "added") {
      // Accept the added line and any preceding removed lines as one atomic operation

      // First, accept any preceding removed lines
      for (let i = lineIndex - 1; i >= 0; i--) {
        const prevLine = processedDiff[i];
        if (prevLine.type === "removed") {
          // Remove from original content
          const originalLines = updatedOriginalContent.split("\n");
          const indexToRemove = originalLines.findIndex(
            (l) => l === prevLine.content
          );
          if (indexToRemove !== -1) {
            originalLines.splice(indexToRemove, 1);
            updatedOriginalContent = originalLines.join("\n");
          }

          // Also remove from current content if it exists
          const currentLines = updatedCurrentContent.split("\n");
          const currentIndexToRemove = currentLines.findIndex(
            (l) => l === prevLine.content
          );
          if (currentIndexToRemove !== -1) {
            currentLines.splice(currentIndexToRemove, 1);
            updatedCurrentContent = currentLines.join("\n");
          }
        } else if (prevLine.type === "unchanged") {
          break;
        }
      }

      // Then accept the added line by adding it to original content
      const originalLines = updatedOriginalContent.split("\n");
      const currentLines = updatedCurrentContent.split("\n");
      const addedLineIndex = currentLines.findIndex((l) => l === line.content);

      if (addedLineIndex !== -1) {
        // Insert this line into the original content at the same relative position
        originalLines.splice(addedLineIndex, 0, line.content);
        updatedOriginalContent = originalLines.join("\n");
      }

      // Update state once with all changes
      setOriginalContent(updatedOriginalContent);
      setPromptContent(updatedCurrentContent);
    } else if (line.type === "removed") {
      // Accept the removal and any following added lines as one atomic operation

      // First, accept the removed line
      const originalLines = updatedOriginalContent.split("\n");
      const lineToRemove = line.content;
      const indexToRemove = originalLines.findIndex((l) => l === lineToRemove);

      if (indexToRemove !== -1) {
        originalLines.splice(indexToRemove, 1);
        updatedOriginalContent = originalLines.join("\n");

        // Also ensure it's removed from current content
        const currentLines = updatedCurrentContent.split("\n");
        const currentIndexToRemove = currentLines.findIndex(
          (l) => l === lineToRemove
        );
        if (currentIndexToRemove !== -1) {
          currentLines.splice(currentIndexToRemove, 1);
          updatedCurrentContent = currentLines.join("\n");
        }
      }

      // Then accept any following added lines
      for (let i = lineIndex + 1; i < processedDiff.length; i++) {
        const nextLine = processedDiff[i];
        if (nextLine.type === "added") {
          // Add to original content
          const originalLinesUpdated = updatedOriginalContent.split("\n");
          const currentLinesUpdated = updatedCurrentContent.split("\n");
          const addedLineIndex = currentLinesUpdated.findIndex(
            (l) => l === nextLine.content
          );

          if (addedLineIndex !== -1) {
            originalLinesUpdated.splice(addedLineIndex, 0, nextLine.content);
            updatedOriginalContent = originalLinesUpdated.join("\n");
          }
        } else if (nextLine.type === "unchanged") {
          break;
        }
      }

      // Update state once with all changes
      setOriginalContent(updatedOriginalContent);
      setPromptContent(updatedCurrentContent);
    }

    // Check if all changes have been processed and exit diff mode if so
    checkAndExitDiffMode(updatedOriginalContent, updatedCurrentContent);
  };

  const checkAndExitDiffMode = (originalText: string, currentText: string) => {
    // Normalize line endings for comparison
    const normalizedOriginal = originalText.endsWith("\n")
      ? originalText
      : originalText + "\n";
    const normalizedCurrent = currentText.endsWith("\n")
      ? currentText
      : currentText + "\n";

    // If there are no differences, exit diff mode
    if (normalizedOriginal === normalizedCurrent) {
      setIsDiffMode(false);
    }
  };

  const handleDiff = (newPrompt: string) => {
    setPromptContent(newPrompt);
    setIsDiffMode(true);
  };

  const handleAcceptAll = () => {
    // Accept all changes by making the current prompt content the new baseline
    setOriginalContent(promptContent || "");
    setIsDiffMode(false);
  };

  const handleRejectAll = () => {
    // Reject all changes by reverting to original content
    setPromptContent(originalContent);
    setIsDiffMode(false);
  };

  const processedDiff = useMemo(() => {
    if (!isDiffMode || !originalContent || !promptContent) return [];

    // Normalize line endings - ensure both texts end with newline for consistent diffing
    const normalizedOldText = originalContent.endsWith("\n")
      ? originalContent
      : originalContent + "\n";
    const normalizedNewText = promptContent.endsWith("\n")
      ? promptContent
      : promptContent + "\n";

    const lineDiffs = diffLines(normalizedOldText, normalizedNewText);
    const processed: ProcessedLine[] = [];
    let oldLineNumber = 1;
    let newLineNumber = 1;

    lineDiffs.forEach((change) => {
      const lines = change.value.split("\n");

      // Remove the last empty line if it exists (from split)
      if (lines[lines.length - 1] === "") {
        lines.pop();
      }

      lines.forEach((line) => {
        if (change.added) {
          const wordChanges = diffWordsWithSpace("", line);
          processed.push({
            type: "added",
            content: line,
            newLineNumber: newLineNumber++,
            wordChanges,
          });
        } else if (change.removed) {
          const wordChanges = diffWordsWithSpace(line, "");
          processed.push({
            type: "removed",
            content: line,
            oldLineNumber: oldLineNumber++,
            wordChanges,
          });
        } else {
          processed.push({
            type: "unchanged",
            content: line,
            oldLineNumber: oldLineNumber++,
            newLineNumber: newLineNumber++,
          });
        }
      });
    });

    return processed;
  }, [originalContent, promptContent, isDiffMode]);

  return {
    processedDiff,
    handleRejectLine,
    handleAcceptLine,
    checkAndExitDiffMode,
    handleDiff,
    handleAcceptAll,
    handleRejectAll,
  };
};
