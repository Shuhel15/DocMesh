"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { getSession, signIn } from "next-auth/react";
import { motion, type Variants } from "framer-motion";
import { FcGoogle } from "react-icons/fc";


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

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || "Registration failed.");
        return;
      }

      setSuccess("Account created successfully. Redirecting to verify your email...");
      sessionStorage.setItem("verificationEmail", email);

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("REGISTER_ERROR:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");
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
    <main className="min-h-screen bg-background px-4 py-16 text-foreground md:mt-20 mt-7 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="show"
        variants={pageVariants}
        className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-6xl items-center justify-center"
      >
        <motion.section className="grid w-full overflow-hidden rounded-3xl border border-border bg-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-sm dark:bg-black/30 md:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            variants={panelVariants}
            className="hidden flex-col justify-center bg-black p-8 text-white dark:bg-white dark:text-black sm:p-10 lg:flex lg:p-12"
          >
            <h1 className="text-2xl font-bold tracking-tight">KNOWLY</h1>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight">
              Create your account
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/80 dark:text-black/80">
              Join Knowly to organize your knowledge, chat with documents, and
              keep everything in one place.
            </p>
            <div className="mt-8 space-y-3 text-sm text-white/80 dark:text-black/80">
              <p>• Save and organize your important documents in one place.</p>
              <p>• Chat with your content and find answers faster.</p>
              <p>• Keep your workflow simple, secure, and productive.</p>
            </div>
          </motion.div>

          <motion.div variants={formVariants} className="p-6 sm:p-8">
            <motion.form onSubmit={handleSubmit} className="space-y-4">
              <motion.h1
                variants={itemVariants}
                className="text-center text-2xl font-bold text-foreground"
              >
                Create your account
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-center text-sm text-black/60 dark:text-white/60"
              >
                Turn your documents into an AI-powered RAG chatbot and embed it
                on your website with just one line of code.
              </motion.p>

              <motion.div variants={itemVariants}>
                <Button
                  onClick={handleGoogleLogin}
                  type="button"
                  variant="outline"
                  disabled={loading || googleLoading}
                  className="mt-2 h-11 w-full rounded-xl border-border bg-white text-black hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60 dark:bg-black/20 dark:text-white dark:hover:bg-white/10"
                >
                  <span className="mr-2 inline-flex items-center justify-center rounded-full bg-white p-0.5 shadow-sm">
                    <FcGoogle />
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
                  htmlFor="name"
                  className="text-sm font-medium text-black/80 dark:text-white/80"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="flex h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-black placeholder:text-muted-foreground/80 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10 dark:bg-black/20 dark:text-white dark:placeholder:text-white/40 dark:focus:border-white dark:focus:ring-white/10"
                />
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
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="flex h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-black placeholder:text-muted-foreground/80 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10 dark:bg-black/20 dark:text-white dark:placeholder:text-white/40 dark:focus:border-white dark:focus:ring-white/10"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-black/80 dark:text-white/80"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="flex h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-black placeholder:text-muted-foreground/80 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10 dark:bg-black/20 dark:text-white dark:placeholder:text-white/40 dark:focus:border-white dark:focus:ring-white/10"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-black/80 dark:text-white/80"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
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

              {success && (
                <motion.p
                  variants={itemVariants}
                  className="text-sm text-green-600 dark:text-green-400"
                >
                  {success}
                </motion.p>
              )}

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="h-11 w-full rounded-xl bg-black text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </motion.div>
            </motion.form>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-center text-sm text-muted-foreground"
            >
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-black underline-offset-4 hover:underline dark:text-white"
              >
                Log in
              </Link>
            </motion.p>
          </motion.div>
        </motion.section>
      </motion.div>
    </main>
  );
}
