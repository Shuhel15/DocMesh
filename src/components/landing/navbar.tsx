/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "How it works", href: "#working" },
  { name: "Features", href: "#features" },
  { name: "Login", href: "/" },
  { name: "Get Started", href: "/" },
];

const navVariants:Variants = {
  hidden: {
    opacity: 0,
    y: -20,
    scale: 0.98,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const linksContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const linkVariants:Variants = {
  hidden: {
    opacity: 0,
    y: -8,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

export default function Navbar() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <motion.header
      initial="hidden"
      animate="show"
      variants={navVariants}
      className="fixed left-1/2 top-5 z-50 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2"
    >
      <motion.nav
        className=" flex min-h-16 items-center rounded-[22px] border border-black/10 bg-white/70 px-4 shadow-2xl backdrop-blur-xl dark:border-white/20 dark:bg-black/40 sm:px-5
        "
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.15,
            duration: 0.4,
            ease: "easeOut",
          }}
        >
          <Link
            href="/"
            onClick={closeMenu}
            className="text-xl font-bold tracking-tight text-black dark:text-white"
          >
            <span className="relative inline-block">
              KNOWLY

              <motion.svg
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{
                  delay: 0.5,
                  duration: 0.7,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute -bottom-3 left-0 h-3 w-full"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
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
              </motion.svg>
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.div
          variants={linksContainer}
          initial="hidden"
          animate="show"
          className="ml-auto hidden items-center gap-1 md:flex"
        >
          {navLinks.map((link) => (
            <motion.div
              key={link.name}
              variants={linkVariants}
              whileHover={{ y: -1 }}
            >
              <Link
                href={link.href}
                className=" block rounded-xl px-4 py-3 text-[15px] font-medium text-black/50 transition hover:bg-zinc-200 hover:text-black dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white
                "
              >
                {link.name}
              </Link>
            </motion.div>
          ))}

          {/* Desktop Theme Toggle */}
          {mounted && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.45,
                duration: 0.3,
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              className=" ml-2 flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-black/50 transition hover:bg-black/5 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10
              "
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </motion.button>
          )}
        </motion.div> 
        
        {/* mobile */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          {/* Mobile Theme Toggle */}
          {mounted && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              className=" flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-black/60 transition hover:bg-black/5 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10
              "
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </motion.button>
          )}

          {/* Hamburger */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className=" flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-black transition hover:bg-black/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10
            "
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -10,
              scale: 0.98,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            className=" mt-2 rounded-[22px] border border-black/10 bg-white/90 p-3 shadow-2xl backdrop-blur-xl dark:border-white/20 dark:bg-black/80 md:hidden
            "
          >
            <motion.div
              initial="hidden"
              animate="show"
              variants={linksContainer}
              className="flex flex-col gap-1"
            >
              {navLinks.map((link) => (
                <motion.div
                  key={link.name}
                  variants={linkVariants}
                >
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className=" block rounded-xl px-4 py-3 text-sm font-medium text-black/60 transition hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white
                    "
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}