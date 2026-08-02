"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, type Variants } from "framer-motion";

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
    </svg>
  );
}

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut", staggerChildren: 0.08 },
  },
};

const panelVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const formVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: "easeOut", staggerChildren: 0.06 },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  const successMessage =
    searchParams.get("verified") === "true"
      ? "Email verified successfully. You can now log in."
      : "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.toLowerCase().includes("verify")) {
          setError("Please verify your email.");
        } else {
          setError("Invalid email or password.");
        }

        return;
      }

      if (result?.ok) {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("LOGIN_ERROR:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("GOOGLE_LOGIN_ERROR:", error);
      setError("Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      if (session) {
        router.replace("/dashboard");
        return;
      }

      setCheckingSession(false);
    };

    checkSession();
  }, [router]);

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8 mt-20 md:mt-10">
      <motion.div
        initial="hidden"
        animate="show"
        variants={pageVariants}
        className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-6xl items-center justify-center"
      >
        <motion.section className="grid w-full overflow-hidden rounded-3xl border border-border bg-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-sm dark:bg-black/30 md:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            variants={panelVariants}
            className="hidden flex-col justify-center bg-black p-8 text-white sm:p-10 lg:flex lg:p-12 dark:bg-white dark:text-black"
          >
            <h1 className="text-2xl font-bold tracking-tight">KNOWLY</h1>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight">
              Welcome back
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/80 dark:text-black/80">
              Log in to continue managing your knowledge and AI assistants.
            </p>
            <div className="mt-8 space-y-3 text-sm text-white/80 dark:text-black/80">
              <p>• Pick up where you left off with your saved documents.</p>
              <p>• Continue chatting with your knowledge base instantly.</p>
              <p>• Keep your workflow simple, secure, and productive.</p>
            </div>
          </motion.div>

          <motion.div variants={formVariants} className="p-6 sm:p-8">
            <motion.form onSubmit={handleSubmit} className="space-y-4">
              <motion.h1
                variants={itemVariants}
                className="text-center text-2xl font-bold text-foreground"
              >
                Welcome back
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-center text-sm text-black/60 dark:text-white/60"
              >
                Welcome back to Knowly. Access your AI chatbot and manage your
                knowledge base—all in one place.
              </motion.p>

              <motion.div variants={itemVariants}>
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading || googleLoading}
                  onClick={handleGoogleLogin}
                  className="mt-2 h-11 w-full rounded-xl border-border bg-white text-black hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60 dark:bg-black/20 dark:text-white dark:hover:bg-white/10"
                >
                  <span className="mr-2 inline-flex items-center justify-center rounded-full bg-white p-0.5 shadow-sm">
                    <GoogleIcon />
                  </span>

                  {googleLoading ? "Connecting..." : "Continue with Google"}
                </Button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex items-center gap-3 py-1"
              >
                <div className="h-px flex-1 bg-border" />

                <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground">
                  OR
                </span>

                <div className="h-px flex-1 bg-border" />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-black/80 dark:text-white/80"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-black placeholder:text-muted-foreground/80 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10 dark:bg-black/20 dark:text-white dark:placeholder:text-white/40 dark:focus:border-white dark:focus:ring-white/10"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-black/80 dark:text-white/80"
                  >
                    Password
                  </label>
                </div>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-black placeholder:text-muted-foreground/80 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10 dark:bg-black/20 dark:text-white dark:placeholder:text-white/40 dark:focus:border-white dark:focus:ring-white/10"
                />
              </motion.div>

              {error && (
                <motion.p
                  variants={itemVariants}
                  className="text-sm text-red-600 dark:text-red-400"
                >
                  {error}
                </motion.p>
              )}

              {successMessage && (
                <motion.p
                  variants={itemVariants}
                  className="text-sm text-green-600 dark:text-green-400"
                >
                  {successMessage}
                </motion.p>
              )}

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="h-11 w-full rounded-xl bg-black text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90"
                >
                  {loading ? "Logging in..." : "Log In"}
                </Button>
              </motion.div>
            </motion.form>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-center text-sm text-muted-foreground"
            >
              Don&lsquo;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-black underline-offset-4 hover:underline dark:text-white"
              >
                Create account
              </Link>
            </motion.p>
          </motion.div>
        </motion.section>
      </motion.div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
