"use client";
import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-10 px-4 bg-white/80 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 text-center flex flex-col items-center gap-4 mt-8">
      <div className="flex flex-wrap gap-6 justify-center mb-2 text-slate-700 dark:text-slate-300 text-sm">
        <a
          href="https://github.com/mazeg-io/promptic.app"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          GitHub
        </a>
        <Link href="/docs?from=home" className="hover:underline">
          Docs
        </Link>
        <Link href="/docs/code-examples?from=home" className="hover:underline">
          Examples
        </Link>
        <a
          href="https://discord.gg/NDuKZa9Mpv"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Community
        </a>
        <a
          href="https://github.com/mazeg-io/promptic.app/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          License
        </a>
      </div>
      <div className="text-xs text-slate-400 dark:text-slate-500 mb-2">
        Open source infrastructure for prompt engineering. &copy;{" "}
        {new Date().getFullYear()} Promptic.
      </div>
      <img
        src="/logo.png"
        alt="Promptic Logo"
        width={32}
        height={32}
        className="mx-auto opacity-40"
      />
    </footer>
  );
}
