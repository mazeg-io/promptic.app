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

interface GlobalState {
  theme: "light" | "dark";
  profile: IUserProfile | null;
}

interface GlobalContextType {
  theme: "light" | "dark";
  setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
  profile: IUserProfile | null;
  resetContext: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { user } = db.useAuth();
  const [profile, setProfile] = useState<IUserProfile | null>(null);

  const { data: profileData } = db.useQuery(
    user?.id
      ? {
          profiles: {
            $: {
              where: {
                $user: user.id,
              },
            },
          },
        }
      : null
  );

  useEffect(() => {
    // Clear profile immediately when user changes to prevent stale data
    if (!user?.id) {
      setProfile(null);
      return;
    }

    // Set profile only if we have data for the current user
    if (profileData?.profiles && profileData?.profiles.length > 0) {
      const profileFromDb = profileData.profiles[0];
      setProfile({
        ...profileFromDb,
        userId: user.id,
      } as IUserProfile);
    } else {
      // No profile data found for this user
      setProfile(null);
    }
  }, [user?.id, profileData]);

  // Immediately clear profile when user changes to prevent stale data
  useEffect(() => {
    setProfile(null);
  }, [user?.id]);

  const resetContext = () => {
    setTheme("light");
    setProfile(null);
  };

  return (
    <GlobalContext.Provider
      value={{
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
