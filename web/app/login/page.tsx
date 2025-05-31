"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { db } from "@/instant";
import { id, lookup } from "@instantdb/react";
import { useGlobal } from "@/lib/context/GlobalContext";

function parseIdToken(idToken: string) {
  try {
    const base64Payload = idToken.split(".")[1];
    const decoded = atob(base64Payload);
    const parsed = JSON.parse(decoded);
    return parsed;
  } catch (error) {
    return null;
  }
}

function Login() {
  const [nonce] = useState(crypto.randomUUID());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setActiveProject } = useGlobal();
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const userInfo = parseIdToken(credentialResponse.credential);
      const { user } = await db.auth.signInWithIdToken({
        clientName: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_NAME || "",
        idToken: credentialResponse.credential,
        nonce,
      });

      if (userInfo && user) {
        // First check if a profile already exists for this user
        const { data: existingProfileData } = await db.queryOnce({
          profiles: {
            $: { where: { $user: user.id } },
          },
        });

        if (
          existingProfileData?.profiles &&
          existingProfileData.profiles.length > 0
        ) {
          // Update existing profile
          const existingProfile = existingProfileData.profiles[0];
          await db.transact([
            db.tx.profiles[existingProfile.id].update({
              firstName: userInfo.given_name || "",
              lastName: userInfo.family_name || "",
              profilePicture: userInfo.picture || "",
              email: userInfo.email || "",
              userId: user.id,
            }),
          ]);
        } else {
          // Create new profile
          try {
            await db.transact([
              db.tx.profiles[id()]
                .update({
                  firstName: userInfo.given_name || "",
                  lastName: userInfo.family_name || "",
                  profilePicture: userInfo.picture || "",
                  email: userInfo.email || "",
                  userId: user.id,
                })
                .link({ $user: user.id }),
            ]);
          } catch (err) {
            console.error("Error creating new profile:", err);
          }
        }

        // Check if the user does not have a project, create one
        const { data: projectsData } = await db.queryOnce({
          projects: {
            $: {
              where: {
                $users: user.id,
              },
            },
          },
        });

        if (!projectsData?.projects || projectsData.projects.length === 0) {
          const projectId = id();
          const now = Date.now();
          const projectName =
            userInfo?.given_name + "'s Project" || "My First Project";

          await db.transact([
            db.tx.projects[projectId]
              .update({
                name: projectName,
                key: crypto.randomUUID(),
                createdAt: now,
                updatedAt: now,
              })
              .link({ $users: user.id }),
          ]);

          const project = await db.queryOnce({
            projects: {
              $: {
                where: { $users: user.id },
              },
            },
          });

          if (project?.data?.projects && project.data.projects.length > 0) {
            setActiveProject(project.data.projects[0]);
          }
        } else {
          // Set the first project as active if user already has projects
          setActiveProject(projectsData.projects[0]);
        }
      }
    } catch (err: any) {
      let errorMessage = "Authentication failed. ";

      if (err.body?.message?.includes("origin")) {
        errorMessage +=
          "Origin validation failed. Please check your domain configuration in InstantDB settings.";
      } else if (err.body?.message?.includes("Validation failed")) {
        errorMessage +=
          "Validation failed. Please check your Google OAuth and InstantDB configuration.";
      } else {
        errorMessage +=
          err.body?.message || err.message || "Unknown error occurred.";
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (error?: any) => {
    setError("Google sign-in failed. Please try again.");
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Welcome to Promptic
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Sign in with your Google account to get started
        </p>
      </div>

      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="w-full flex items-center justify-center">
            <GoogleLogin
              nonce={nonce}
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
              theme="outline"
              size="large"
              width="100%"
              text="continue_with"
              shape="rectangular"
              logo_alignment="left"
            />
          </div>

          {isLoading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900 dark:border-slate-100 mx-auto"></div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Signing you in...
              </p>
            </div>
          )}

          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            <p>
              By continuing, you agree to our{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          New to Promptic? No worries! Signing in with Google will automatically
          create your account.
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
      >
        <Login />
      </GoogleOAuthProvider>
    </div>
  );
}
