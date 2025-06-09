import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ClientDoc } from "../docs/ClientDoc";

function DocsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>API Documentation</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
          <ClientDoc />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DocsModal;
