"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Bot, ArrowRight } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { motion, type Variants } from "framer-motion";

type Chatbot = {
  id: string;
  name: string;
  createdAt: string;
};

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

export default function ChatbotsPage() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        // fetch chatbots from the API
        const response = await fetch("/api/chatbots");
        const data = await response.json();

        if (data.success) {
          setChatbots(data.chatbots);
        }
      } catch (error) {
        console.error("FETCH_CHATBOTS_ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatbots();
  }, []);

  return (
    <main className="min-h-screen bg-background px-6 pt-30 pb-10 text-foreground">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-6xl"
      >
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Your Chatbots
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Create and manage your AI chatbots.
            </p>
          </div>

          <Link
            href="/dashboard/chatbots/new"
            className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-all duration-200 hover:opacity-80 hover:scale-105"
          >
            <Plus size={18} />
            Create Chatbot
          </Link>
        </motion.div>

        <div className="mt-10">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          ) : chatbots.length === 0 ? (
            <motion.div variants={itemVariants} className="rounded-xl border border-dashed border-border bg-background p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted text-foreground">
                <Bot size={24} />
              </div>

              <h2 className="mt-4 text-lg font-semibold">
                No chatbots yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Create your first chatbot and train it with your own
                knowledge.
              </p>

              <Link
                href="/dashboard/chatbots/new"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-all duration-200 hover:opacity-80 hover:scale-105"
              >
                <Plus size={18} />
                Create your first chatbot
              </Link>
            </motion.div>
          ) : (
            <motion.div variants={containerVariants} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {chatbots.map((chatbot) => (
                <motion.div
                  key={chatbot.id}
                  variants={itemVariants}
                  className="group rounded-xl border border-border bg-background p-5 transition-all duration-200 hover:border-foreground/40 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-muted text-foreground transition-colors duration-200 group-hover:bg-foreground group-hover:text-background">
                      <Bot size={22} />
                    </div>

                    <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      Active
                    </span>
                  </div>

                  <h2 className="mt-5 truncate text-lg font-semibold">
                    {chatbot.name}
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Created{" "}
                    {new Date(chatbot.createdAt).toLocaleDateString()}
                  </p>

                  <Link
                    href={`/dashboard/chatbots/${chatbot.id}`}
                    className="mt-5 flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-muted"
                  >
                    Open Chatbot
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </main>
  );
}