"use client";

import { motion, type Variants } from "framer-motion";
import { Bot, FileText, Brain, Code2 } from "lucide-react";

const steps = [
  {
    title: "Create Your Chatbot",
    description:
      "Create a chatbot for your company or project in just a few clicks.",
    icon: Bot,
  },
  {
    title: "Add Your Knowledge",
    description:
      "Upload PDF, TXT, DOC, DOCX files or add your content manually.",
    icon: FileText,
  },
  {
    title: "AI Learns Your Data",
    description:
      "Your content is processed, chunked and converted into searchable knowledge.",
    icon: Brain,
  },
  {
    title: "Embed & Start Chatting",
    description:
      "Add your chatbot to any website using a simple embed script.",
    icon: Code2,
  },
];

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

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-28 border-t border-border bg-background px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            How It Works
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            From your knowledge to an AI chatbot.
          </h2>

          <p className="mt-5 text-muted-foreground">
            Build, train and embed your own AI chatbot in four simple steps.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                  transition: { duration: 0.25 },
                }}
                className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/50 transition-transform duration-300 group-hover:scale-110">
                  <Icon
                    size={19}
                    strokeWidth={1.8}
                    className="text-foreground"
                  />
                </div>

                <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}