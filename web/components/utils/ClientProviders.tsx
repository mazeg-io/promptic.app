"use client";

import { GlobalProvider } from "../../lib/context/GlobalContext";
import { AuthProvider } from "@/components/utils/AuthProvider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <GlobalProvider>
      <AuthProvider>{children}</AuthProvider>
    </GlobalProvider>
  );
}
