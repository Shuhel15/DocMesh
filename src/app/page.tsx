"use client";

import ChatbotPreview from "@/components/landing/ChatbotPreview";
import CTA from "@/components/landing/CTA";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { MoveRight } from "lucide-react";
import { useSession } from "next-auth/react";

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

export default function Home() {
  const { data: session } = useSession();
  const isAuthenticated = Boolean(session?.user);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section
        id="home"
        className="flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="w-full max-w-3xl mt-20 items-center justify-center text-center"
        >
          <motion.p
            variants={itemVariants}
            className="mx-auto mb-4 w-fit border-b-2 text-center text-sm font-medium text-muted-foreground"
          >
            AI Chatbot Platform
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold tracking-tight sm:text-6xl"
          >
            Your Data. Your Bot.{" "}
            <span className="relative inline-block">
              Zero Friction.
              <motion.svg
                initial={{ opacity: 0, pathLength: 0 }}
                whileInView={{ opacity: 1, pathLength: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.4,
                  duration: 0.8,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute -bottom-3 left-0 h-3 w-full"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <motion.path
                  d="M2 6 Q35 3 65 7 T125 6 T198 7"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.75"
                />
              </motion.svg>
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            Connect your knowledge, train your AI, and give your users instant
            answers—right on your website.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={isAuthenticated ? "/dashboard" : "/login"}
                className="inline-block rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Build Your Chatbot
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/#how-it-works"
                className="flex flex-row items-center justify-center gap-2 rounded-md border border-border px-6 py-3 font-medium transition-colors hover:bg-muted"
              >
                Learn More
                <MoveRight size={16} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Chatbot Preview */}
          <motion.div
            initial={{
              opacity: 0,
              y: 60,
              scale: 0.95,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="mt-16"
          >
            <ChatbotPreview />
          </motion.div>
        </motion.div>
      </section>
      <HowItWorks />
      <Features />
      <CTA />
    </main>
  );
}
