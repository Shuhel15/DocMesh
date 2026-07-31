"use client";

import { motion, type Variants } from "framer-motion";
import { FileUp, PenLine, BrainCircuit, Code2 } from "lucide-react";

const features = [
  {
    title: "Document Upload",
    description:
      "Upload PDF, TXT, DOC or DOCX files and turn your existing content into chatbot knowledge.",
    icon: FileUp,
  },
  {
    title: "Manual Knowledge",
    description:
      "Don't have a document? Add your company's knowledge manually with simple text input.",
    icon: PenLine,
  },
  {
    title: "Smart RAG",
    description:
      "The chatbot retrieves relevant information from your knowledge base before generating an answer.",
    icon: BrainCircuit,
  },
  {
    title: "Easy Embed",
    description:
      "Add your chatbot to any website using a lightweight embed script.",
    icon: Code2,
  },
];

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 35,
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

export default function Features() {
  return (
    <section
      id="features"
      className="border-t border-border bg-muted/30 px-6 py-24"
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
          className="max-w-2xl"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Features
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            Everything you need to build an AI chatbot.
          </h2>

          <p className="mt-5 text-muted-foreground">
            Powerful features to turn your business knowledge into a useful AI
            assistant.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2"
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover={{
                  y: -5,
                  transition: {
                    duration: 0.25,
                  },
                }}
                className="group bg-background p-8 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/50 transition-transform duration-300 group-hover:scale-110">
                  <Icon
                    size={19}
                    strokeWidth={1.8}
                    className="text-foreground"
                  />
                </div>

                <h3 className="mt-8 text-2xl font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-4 max-w-md leading-7 text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}