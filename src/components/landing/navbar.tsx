/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "How it works", href: "/about" },
  { name: "Login", href: "/projects" },
  { name: "Get Started", href: "/" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed left-1/2 top-5 z-50 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2">
      <nav
        className=" flex h-18 items-center rounded-[22px] border border-white/20 bg-black/10 px-5 shadow-2xl backdrop-blur-xl
        "
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight dark:text-white  text-black"
        >
<span className="relative inline-block">
 KNOWLY

  <svg
    className="pointer-events-none absolute -bottom-3 left-0 h-3 w-full"
    viewBox="0 0 200 12"
    fill="none"
    preserveAspectRatio="none"
  >
<>
  <path
    d="M2 7 C35 3 65 9 100 6 S165 3 198 7"
    stroke="currentColor"
    strokeWidth="5"
    strokeLinecap="round"
    opacity="0.25"
  />
  <path
    d="M2 6 C35 2 65 8 100 5 S165 2 198 6"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  />
</>
  </svg>
</span>
        
        </Link>

        {/* Navigation */}
        <div className="ml-auto flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className=" rounded-xl px-5 py-3 text-[15px] font-medium text-black/50 hover:bg-zinc-300 hover:text-black  dark:text-white/60 transition dark:hover:bg-white/10 dark:hover:text-white
              "
            >
              {link.name}
            </Link>
          ))}

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              className=" font-serif ml-2 flex h-9 w-9 items-center justify-center rounded-full border text-black/50 border-black/10 dark:border-white/20 dark:bg-white/5 dark:text-white transition dark:hover:bg-white/10
              "
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}