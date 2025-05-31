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
import { AppSchema } from "@/instant.schema";

interface GlobalState {
  theme: "light" | "dark";
  profile: IUserProfile | null;
}

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

  useEffect(() => {
    if (user?.id && !activeProject) {
      const fetchActiveProject = async () => {
        const { data } = await db.queryOnce({
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
        });
        if (data?.projects && data.projects.length > 0) {
          setActiveProject(data.projects[0]);
        }
      };
      fetchActiveProject();
    }
  }, [user?.id, activeProject]);

  useEffect(() => {
    if (user?.id && !profile) {
      const fetchProfile = async () => {
        const { data } = await db.queryOnce({
          profiles: {
            $: { where: { $user: user.id } },
          },
        });
        if (data?.profiles && data.profiles.length > 0) {
          setProfile({
            ...data.profiles[0],
            userId: user.id,
          } as IUserProfile);
        }
      };
      fetchProfile();
    }
  }, [user?.id, profile]);

  useEffect(() => {
    if (!user?.id) {
      setProfile(null);
      setActiveProject(null);
    }
  }, [user?.id]);

  const resetContext = () => {
    setTheme("light");
    setProfile(null);
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
