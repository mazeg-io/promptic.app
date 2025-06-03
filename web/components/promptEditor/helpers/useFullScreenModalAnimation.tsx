import { EditingPrompt } from "@/components/flow/FlowCanvas";
import { useCallback, useEffect, useState } from "react";

export const useFullScreenModalAnimation = ({
  isOpen,
  prompt,
  onClose,
  modalRef,
}: {
  isOpen: boolean;
  prompt: EditingPrompt;
  onClose: () => void;
  modalRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<
    "opening" | "open" | "closing"
  >("opening");
  const [sidebarOpacity, setSidebarOpacity] = useState(0);
  useEffect(() => {
    if (isOpen && prompt.animationOrigin) {
      setIsAnimating(true);
      setAnimationPhase("opening");
      setSidebarOpacity(0); // Reset sidebar opacity

      // Start animation
      if (modalRef.current) {
        const { x, y, width, height } = prompt.animationOrigin;

        // Set initial position and size
        modalRef.current.style.position = "fixed";
        modalRef.current.style.left = `${x}px`;
        modalRef.current.style.top = `${y}px`;
        modalRef.current.style.width = `${width}px`;
        modalRef.current.style.height = `${height}px`;
        modalRef.current.style.transform = "none";
        modalRef.current.style.borderRadius = "8px";
        modalRef.current.style.overflow = "hidden";

        // Force a reflow
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        modalRef.current.offsetHeight;

        // Add transition
        modalRef.current.style.transition =
          "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";

        // Animate to full screen
        requestAnimationFrame(() => {
          if (modalRef.current) {
            modalRef.current.style.left = "0px";
            modalRef.current.style.top = "0px";
            modalRef.current.style.width = "100vw";
            modalRef.current.style.height = "100vh";
            modalRef.current.style.borderRadius = "0px";
          }
        });

        // Complete animation
        const timeout = setTimeout(() => {
          setIsAnimating(false);
          setAnimationPhase("open");
          if (modalRef.current) {
            modalRef.current.style.transition = "";
          }
        }, 400);

        return () => clearTimeout(timeout);
      }
    } else if (isOpen) {
      // No animation origin, just show immediately
      setAnimationPhase("open");
      setSidebarOpacity(0); // Reset sidebar opacity for immediate fade-in
    }
  }, [isOpen, prompt.animationOrigin]);

  // Handle sidebar fade-in animation when main animation completes
  useEffect(() => {
    if (animationPhase === "open") {
      // Small delay then fade in sidebar
      const timer = setTimeout(() => {
        setSidebarOpacity(1);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [animationPhase]);

  // Handle closing animation
  const handleClose = useCallback(() => {
    if (prompt.animationOrigin && modalRef.current) {
      setAnimationPhase("closing");
      setIsAnimating(true);

      const { x, y, width, height } = prompt.animationOrigin;

      // Add transition
      modalRef.current.style.transition =
        "all 0.3s cubic-bezier(0.4, 0, 0.6, 1)";

      // Animate back to original position
      modalRef.current.style.left = `${x}px`;
      modalRef.current.style.top = `${y}px`;
      modalRef.current.style.width = `${width}px`;
      modalRef.current.style.height = `${height}px`;
      modalRef.current.style.borderRadius = "8px";

      setTimeout(() => {
        onClose();
      }, 300);
    } else {
      onClose();
    }
  }, [prompt.animationOrigin, onClose]);

  return {
    isAnimating,
    animationPhase,
    sidebarOpacity,
    handleClose,
  };
};
