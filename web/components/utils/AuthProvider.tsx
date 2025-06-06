"use client";

import { useEffect } from "react";
import { db } from "@/instant";
import { useRouter, usePathname } from "next/navigation";
import { useGlobal } from "@/lib/context/GlobalContext";

const PUBLIC_ROUTES = ["/login", "/"];

const AUTH_ROUTES = ["/login"];

const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some((route) => {
    // Exact match for most routes
    if (route === pathname) return true;

    // Handle dynamic routes (e.g., /blog/[slug])
    if (route.includes("[") && route.includes("]")) {
      const routePattern = route.replace(/\[.*?\]/g, "[^/]+");
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(pathname);
    }

    return false;
  });
};

// Helper function to check if a route is auth-specific
const isAuthRoute = (pathname: string): boolean => {
  return AUTH_ROUTES.includes(pathname);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoading, user } = db.useAuth();
  const { profile } = useGlobal();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user && !isPublicRoute(pathname)) {
        // User not authenticated and not on a public route, redirect to login
        router.push("/login");
      } else if (user && isAuthRoute(pathname)) {
        // User authenticated but on an auth-specific page, redirect to home
        router.push("/canvas");
      }
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading || (user && !profile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-slate-100 mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
