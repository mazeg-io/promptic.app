import { db } from "@/instant";
import { useCallback } from "react";

export const useFlowUpdates = () => {

  const updatePositionInDB = useCallback(
    async (
      nodeId: string,
      position: { x: number; y: number },
      informationId: string
    ) => {
      try {
        await db.transact([
          db.tx.prompt_information[informationId].update({
            positionX: Math.round(position.x),
            positionY: Math.round(position.y),
            updatedAt: Date.now(),
          }),
        ]);
      } catch (error) {
        console.error("Failed to update position:", error);
      }
    },
    []
  );

  return { updatePositionInDB };
};
