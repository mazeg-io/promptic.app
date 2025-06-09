import { useState, useCallback, useEffect, useRef } from "react";

interface UseResizableSidebarProps {
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export const useResizableSidebar = ({
  initialWidth = 400,
  minWidth = 280,
  maxWidth = 800,
}: UseResizableSidebarProps = {}) => {
  const [sidebarWidth, setSidebarWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResize = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = window.innerWidth - e.clientX;
      const constrainedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
      setSidebarWidth(constrainedWidth);
    },
    [isResizing, minWidth, maxWidth]
  );

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResize);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("mouseup", stopResize);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [isResizing, resize, stopResize]);

  return {
    sidebarWidth,
    isResizing,
    startResize,
    resizeRef,
  };
};
