import React, { useEffect, useRef } from "react";

function LiveComment({
  mousePosition,
  setIsLiveCommenting,
  setMousePosition,
  isLiveCommenting,
  liveCommentText,
  setLiveCommentText,
}: {
  mousePosition: { x: number; y: number };
  setIsLiveCommenting: React.Dispatch<React.SetStateAction<boolean>>;
  setMousePosition: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >;
  isLiveCommenting: boolean;
  liveCommentText: string;
  setLiveCommentText: React.Dispatch<React.SetStateAction<string>>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when live commenting becomes active
  useEffect(() => {
    if (isLiveCommenting && inputRef.current) {
      inputRef.current.focus();
      // Hide system cursor when live commenting
      document.body.style.cursor = "none";
      // Also hide cursor on all elements
      const style = document.createElement("style");
      style.id = "hide-cursor-style";
      style.textContent = "* { cursor: none !important; }";
      document.head.appendChild(style);
    } else {
      // Restore system cursor when not live commenting
      document.body.style.cursor = "auto";
      // Remove the style that hides cursor
      const style = document.getElementById("hide-cursor-style");
      if (style) {
        style.remove();
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.cursor = "auto";
      const style = document.getElementById("hide-cursor-style");
      if (style) {
        style.remove();
      }
    };
  }, [isLiveCommenting]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" || event.code === "Slash") {
        // Check if any input element is currently focused
        const activeElement = document.activeElement;
        const isInputFocused =
          activeElement &&
          (activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA" ||
            activeElement.getAttribute("contenteditable") === "true" ||
            (activeElement as HTMLElement).isContentEditable);

        // Only prevent default and open comment if no input is focused
        if (!isInputFocused) {
          event.preventDefault();
          setIsLiveCommenting(true);
        }
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setLiveCommentText("");
        setIsLiveCommenting(false);
        document.body.style.cursor = "auto";
        const style = document.getElementById("hide-cursor-style");
        if (style) {
          style.remove();
        }
      }
    };

    // Remove capture phase to let textarea handle the event first
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setIsLiveCommenting, setLiveCommentText]);

  // Track mouse position globally
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [setMousePosition]);

  return (
    <>
      {/* Custom cursor - always visible when live commenting */}
      {isLiveCommenting && (
        <div
          className="fixed pointer-events-none"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            width: "12px",
            height: "12px",
            border: "2px solid black",
            borderRadius: "50%",
            backgroundColor: "white",
            transform: "translate(-6px, -6px)",
            zIndex: 9999,
          }}
        />
      )}

      {isLiveCommenting && (
        <div
          className="fixed z-50"
          style={{
            left: mousePosition.x + 5,
            top: mousePosition.y + 10,
          }}
        >
          <input
            className="bg-red-500 min-w-[140px] hover:bg-red-600 placeholder:text-gray-200 text-white px-4 py-2 rounded-full text-sm shadow-lg font-medium"
            style={{
              width: `${Math.max(
                120,
                Math.min(400, liveCommentText.length * 8 + 10)
              )}px`,
            }}
            value={liveCommentText}
            onChange={(e) => setLiveCommentText(e.target.value)}
            placeholder="Say something"
            ref={inputRef}
          />
        </div>
      )}
    </>
  );
}

export default LiveComment;
