import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { db } from "@/instant";

function ProjectFooter() {
  return (
    <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 py-[16px] px-[32px]">
      <div className="flex items-center justify-end">
        <Button
          variant="outline"
          onClick={() => {
            db.auth.signOut();
          }}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 border-slate-300 dark:border-slate-600"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export default ProjectFooter;
