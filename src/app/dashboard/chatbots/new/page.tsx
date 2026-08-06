"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { MoveLeft, Loader2 } from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
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

export default function NewChatbotPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || loading) return;

    setLoading(true);

    try {
      const response = await fetch("/api/chatbots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        setLoading(false);
        return;
      }

      console.log("Chatbot created:", data.chatbot);

      router.push(`/dashboard/chatbots/${data.chatbot.id}`);
    } catch (error) {
      console.error("CREATE CHATBOT ERROR:", error);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground px-4 sm:px-6 pt-24 sm:pt-30 pb-10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-2xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-10">
          <Link
            href="/dashboard/chatbots"
            className="group mb-6 text-sm text-muted-foreground transition-colors hover:text-foreground flex items-center flex-row gap-2"
          >
            <MoveLeft size={16} className="group-hover:transition-transform group-hover:-translate-x-1" /> Back to Chatbots
          </Link>

          <h1 className="text-3xl font-semibold tracking-tight">
            Create your AI chatbot
          </h1>

          <p className="mt-2 text-muted-foreground">
            Give your chatbot a name to get started.
          </p>
        </motion.div>

        <motion.form variants={itemVariants} onSubmit={handleCreate} className="space-y-6">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Chatbot Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Customer Support Bot"
              disabled={loading}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-foreground focus:ring-1 focus:ring-foreground disabled:opacity-60"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
            <Link
              href="/dashboard/chatbots"
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                "Create Chatbot"
              )}
            </button>
          </div>
        </motion.form>
      </motion.div>
    </main>
  );
}

