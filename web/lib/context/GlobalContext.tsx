"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { db } from "@/instant";
import { IUserProfile } from "@/interaces/IUser";
import { IProject } from "@/interaces/IProject";

interface GlobalContextType {
  theme: "light" | "dark";
  setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
  profile: IUserProfile | null;
  activeProject: IProject | null;
  setActiveProject: React.Dispatch<React.SetStateAction<IProject | null>>;
  resetContext: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { user } = db.useAuth();
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [activeProject, setActiveProject] = useState<IProject | null>(null);

  // Apply theme to document and persist to localStorage
  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme class to document
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Save theme to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Use reactive query for profile to automatically update when profile is created/updated
  const { data: profileData } = db.useQuery(
    user?.id
      ? {
          profiles: {
            $: { where: { $user: user.id } },
          },
        }
      : null
  );

  // Use reactive query for active project to automatically update
  const { data: projectData } = db.useQuery(
    user?.id
      ? {
          projects: {
            $: {
              where: {
                $users: user.id,
              },
              limit: 1,
              order: {
                updatedAt: "desc",
              },
            },
          },
        }
      : null
  );

  // Update profile state when query data changes
  useEffect(() => {
    if (profileData?.profiles?.[0]) {
      setProfile({
        ...profileData.profiles[0],
        userId: user?.id || "",
      } as IUserProfile);
    } else if (user?.id && profileData?.profiles?.length === 0) {
      // Profile query returned empty array, meaning no profile exists yet
      setProfile(null);
    }
  }, [profileData, user?.id]);

  // Update activeProject state when query data changes
  useEffect(() => {
    if (
      projectData?.projects &&
      projectData?.projects?.length > 0 &&
      projectData?.projects?.[0]
    ) {
      setActiveProject(projectData.projects[0]);
    } else if (user?.id && projectData?.projects?.length === 0) {
      // Project query returned empty array, meaning no projects exist yet
      setActiveProject(null);
    }
  }, [projectData, user?.id]);

  useEffect(() => {
    if (!user?.id) {
      setProfile(null);
      setActiveProject(null);
    }
  }, [user?.id]);

  const resetContext = () => {
    setTheme("light");
    setProfile(null);
    setActiveProject(null);
  };

  return (
    <GlobalContext.Provider
      value={{
        activeProject,
        setActiveProject,
        theme,
        setTheme,
        profile,
        resetContext,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
}
