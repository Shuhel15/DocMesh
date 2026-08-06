/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";

const baseNavLinks = [
  { name: "Home", href: "/#home" },
  { name: "How it works", href: "/#how-it-works" },
  { name: "Features", href: "/#features" },
];

const navVariants: Variants = {
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

const linkVariants: Variants = {
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
  const router = useRouter();
  const { data: session } = useSession();

  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthenticated = Boolean(session?.user);

  const navLinks = isAuthenticated
    ? [...baseNavLinks, { name: "Dashboard", href: "/dashboard" }]
    : baseNavLinks;

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    closeMenu();
    await signOut({ callbackUrl: "/" });
  };

  const handleActionClick = () => {
    closeMenu();
    router.push(isAuthenticated ? "/dashboard" : "/register");
  };

  return (
    <motion.header
      initial="hidden"
      animate="show"
      variants={navVariants}
      className="fixed left-1/2 top-3 sm:top-5 z-50 w-[calc(100%-1.25rem)] sm:w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2"
    >
      <motion.nav className="flex min-h-14 sm:min-h-16 items-center justify-between rounded-[20px] sm:rounded-[22px] border border-black/10 bg-white/80 px-3.5 sm:px-6 shadow-2xl backdrop-blur-xl dark:border-white/20 dark:bg-black/60">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.15,
            duration: 0.4,
            ease: "easeOut",
          }}
          className="shrink-0"
        >
          <Link
            href="/"
            onClick={closeMenu}
            className="text-xl font-bold tracking-tight text-foreground"
          >
            <span className="relative inline-block text-3xl">
            𝔻
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation Links */}
        <motion.div
          variants={linksContainer}
          initial="hidden"
          animate="show"
          className="hidden items-center gap-1 md:flex"
        >
          {navLinks.map((link) => (
            <motion.div key={link.name} variants={linkVariants} whileHover={{ y: -1 }}>
              <Link
                href={link.href}
                className="block rounded-xl px-3.5 py-2 text-[15px] font-medium text-foreground/80 transition hover:bg-muted hover:text-foreground dark:hover:bg-white/10 dark:hover:text-white"
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Desktop Right Actions */}
        <div className="hidden items-center gap-2.5 md:flex">
          {isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl px-3.5 py-2 text-[15px] font-medium text-foreground/80 transition hover:bg-muted hover:text-foreground dark:hover:bg-white/10 dark:hover:text-white"
              >
                Logout
              </button>
              <Link
                href="/dashboard"
                className="rounded-xl bg-foreground px-4 py-2 text-[14px] font-semibold text-background transition hover:opacity-90"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl px-3.5 py-2 text-[15px] font-medium text-foreground/80 transition hover:bg-muted hover:text-foreground dark:hover:bg-white/10 dark:hover:text-white"
              >
                Login
              </Link>
              <button
                type="button"
                onClick={handleActionClick}
                className="rounded-xl bg-foreground px-4 py-2 text-[14px] font-semibold text-background transition hover:opacity-90"
              >
                Get Started
              </button>
            </>
          )}

          {/* Theme Toggle */}
          {mounted && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-foreground transition hover:bg-muted dark:border-white/20 dark:hover:bg-white/10"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </motion.button>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          {mounted && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-foreground transition hover:bg-muted dark:border-white/20 dark:hover:bg-white/10"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </motion.button>
          )}

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center rounded-lg justify-center  text-foreground transition hover:bg-muted dark:border-white/20 dark:hover:bg-white/10"
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

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mt-2 max-h-[75vh] overflow-y-auto flex items-center justify-center rounded-[22px] border border-black/10 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-white/20 dark:bg-black/90 md:hidden"
          >
            <div className="flex w-full flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-2.5 text-center text-sm font-medium text-foreground/80 transition hover:bg-muted"
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
                  >
                    Logout
                  </button>
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="w-full rounded-xl bg-foreground px-4 py-2.5 text-center text-sm font-semibold text-background transition hover:opacity-90"
                  >
                    Go to Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="w-full rounded-xl border border-border px-4 py-2.5 text-center text-sm font-medium text-foreground transition hover:bg-muted"
                  >
                    Login
                  </Link>
                  <button
                    type="button"
                    onClick={handleActionClick}
                    className="w-full rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition hover:opacity-90"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}