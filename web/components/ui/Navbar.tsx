"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const menu = [
  { label: "Demo", href: "#demo" },
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "Open Source", href: "#opensource" },
  { label: "Docs", href: "/docs?from=home", isExternal: true },
  {
    label: "Examples",
    href: "/docs/code-examples?from=home",
    isExternal: true,
  },
];

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between py-4 px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center">
        <Image
          src="/logo.png"
          alt="Promptic Logo"
          width={50}
          height={50}
          className="rounded-md"
        />
      </div>
      {/* Nav Links */}
      <div className="hidden md:flex gap-6 text-slate-700 dark:text-slate-200 text-sm font-medium">
        {menu.map((item) =>
          item.isExternal ? (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-indigo-600 cursor-pointer"
            >
              {item.label}
            </Link>
          ) : (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-indigo-600 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                if (typeof window !== "undefined") {
                  const el = document.querySelector(item.href);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.location.hash = item.href;
                  }
                }
              }}
            >
              {item.label}
            </a>
          )
        )}
      </div>
      {/* Actions */}
      <div className="flex gap-2">
        <a
          href="#getstarted"
          className="px-4 py-2 rounded-md bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold hover:bg-slate-700 dark:hover:bg-slate-200"
          onClick={(e) => {
            // Redirect to /login
            e.preventDefault();
            window.location.href = "/login";
          }}
        >
          Get Started
        </a>
      </div>
    </nav>
  );
}
