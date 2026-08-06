"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CTA() {
  const { data: session } = useSession();
  const isAuthenticated = Boolean(session?.user);

  return (
    <section className="border-t border-border px-4 sm:px-6 py-16 sm:py-24">
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
          scale: 0.97,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        viewport={{
          once: true,
          amount: 0.25,
        }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className="mx-auto max-w-5xl rounded-3xl border border-border bg-foreground px-4 py-12 text-center text-background sm:px-12 sm:py-16"
      >
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 0.6, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
          className="text-xs sm:text-sm font-medium uppercase tracking-widest"
        >
          Get Started
        </motion.p>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.15,
          }}
          className="mx-auto mt-3 sm:mt-4 max-w-2xl text-2xl xs:text-3xl font-bold tracking-tight sm:text-5xl"
        >
          Let your knowledge start talking.
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.7, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.25,
          }}
          className="mx-auto mt-5 max-w-xl text-sm leading-6 sm:text-base"
        >
          Turn your knowledge into an AI assistant that’s ready to help your
          users, anywhere on your website.
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: 0.35,
          }}
          className="mt-8"
        >
          <motion.div
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="inline-block"
          >
            <Link
              href={isAuthenticated ? "/dashboard" : "/login"}
              className="group flex flex-row  items-center justify-center gap-2 rounded-md bg-background px-6 py-3 text-sm font-medium text-foreground transition-opacity hover:opacity-80"
            >
              Get Started <MoveRight size={16} className="transition-transform group-hover:translate-x-1"/>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}