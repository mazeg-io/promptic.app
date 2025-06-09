"use client";

import React, { useState } from "react";
import { Settings, ChevronDown, Github, Book, Plus, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectSettingsModal from "@/components/utils/ProjectSettingsModal";
import { useGlobal } from "@/lib/context/GlobalContext";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import prompticLogo from "@/public/logo.png";
import { db } from "@/instant";
import DocsModal from "@/components/utils/DocsModal";
import CreateProjectModal from "@/components/utils/CreateProjectModal";
import { useRouter } from "next/navigation";

export const LeftToolbar = () => {
  const router = useRouter();
  const { activeProject, profile, setActiveProject } = useGlobal();
  const [isProjectSettingsModalOpen, setIsProjectSettingsModalOpen] =
    useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  // Query to get all user projects for the dropdown
  const { data: userProjectsData } = db.useQuery(
    profile?.userId
      ? {
          projects: {
            $: {
              where: {
                $users: profile.userId,
              },
            },
          },
        }
      : null
  );
  return (
    <>
      {isProjectSettingsModalOpen && (
        <ProjectSettingsModal
          isOpen={isProjectSettingsModalOpen}
          onClose={() => setIsProjectSettingsModalOpen(false)}
        />
      )}
      {isCreateProjectModalOpen && (
        <CreateProjectModal
          isCreateProjectModalOpen={isCreateProjectModalOpen}
          setIsCreateProjectModalOpen={setIsCreateProjectModalOpen}
        />
      )}
      {isDocsModalOpen && (
        <DocsModal
          isOpen={isDocsModalOpen}
          onClose={() => setIsDocsModalOpen(false)}
        />
      )}
      <div className="absolute top-4 left-4 z-10 h-[50px] flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg px-2 border">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger
              asChild
              className="border-0 !bg-transparent hover:!bg-gray-700/20"
            >
              <div className="flex items-center h-[36px] hover:bg-gray-100 dark:hover:bg-gray-800/30 rounded-md  pr-[8px]  p-2 pl-0">
                <img
                  src={prompticLogo.src}
                  alt="promptic"
                  className="w-[36px] h-[36px]"
                />
                <span className="mr-1 px-1 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded">
                  BETA
                </span>
                {/* <Layers className="text-gray-600 dark:text-white w-[18px] h-[18px]" /> */}
                <ChevronDown className="text-gray-600 dark:text-gray-400 w-[12px] h-[12px]" />
              </div>
            </MenubarTrigger>
            <MenubarContent>
              {userProjectsData?.projects?.map((project: any) => (
                <MenubarItem
                  key={project.id}
                  onClick={() => {
                    if (project.id !== activeProject?.id) {
                      setActiveProject(project);
                    }
                  }}
                >
                  {project.id === activeProject?.id ? (
                    <>
                      <div className="w-[6px] h-[6px] bg-purple-600 rounded-full" />
                      <span className="text-purple-600">{project.name}</span>
                    </>
                  ) : (
                    <span>{project.name}</span>
                  )}
                </MenubarItem>
              ))}
              <MenubarItem
                onClick={() => {
                  setIsCreateProjectModalOpen(true);
                }}
                className="bg-gray-100 dark:bg-gray-700 mt-[6px]"
              >
                <Plus className="dark:text-gray-300" />
                <span className="dark:text-gray-300">New Project</span>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={() => router.push("/docs?from=canvas")}>
                <Book className="dark:text-gray-300" />
                <span className="dark:text-gray-300">Docs</span>
              </MenubarItem>
              <MenubarItem
                onClick={() => router.push("/docs/code-examples?from=canvas")}
              >
                <Code className="dark:text-gray-300" />
                <span className="dark:text-gray-300">Code Examples</span>
              </MenubarItem>
              <MenubarItem
                onClick={() =>
                  window.open(
                    "https://github.com/mazeg-io/promptic.app",
                    "_blank"
                  )
                }
              >
                <Github className="dark:text-gray-300" />
                <span className="dark:text-gray-300">Contribute</span>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem
                className="text-red-600 dark:text-red-400"
                onClick={() => {
                  db.auth.signOut();
                }}
              >
                <span>Logout</span>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        <div className="h-full flex items-center">
          <p className="text-gray-800 dark:text-gray-200 text-xs h-[calc(100%-16px)] font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md px-[8px] flex items-center transition-colors duration-150">
            {activeProject?.name}
          </p>
        </div>
        <div className="h-full w-[1px] mx-[8px] bg-r bg-gray-300 dark:bg-gray-600" />

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setIsProjectSettingsModalOpen(true)}
        >
          <Settings className="h-4 w-4 dark:text-gray-300" />
        </Button>
      </div>
    </>
  );
};
