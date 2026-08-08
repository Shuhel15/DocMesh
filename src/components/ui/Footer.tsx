"use client";

import { motion, type Variants } from "framer-motion";
import { FaHeart } from "react-icons/fa";

const footerLinks = {
  Product: ["Features", "How It Works"],
  Resources: ["Documentation", "Contact"],
  Company: ["About", "GitHub"],
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

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background px-4 sm:px-6 py-10 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Brand */}
          <motion.div variants={itemVariants}>
            <motion.h3
              whileHover={{ x: 3 }}
              className="inline-block text-lg font-bold tracking-tight"
            >
              𝔻
            </motion.h3>

            <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
              Turn your knowledge into an AI chatbot and embed it anywhere.
            </p>
          </motion.div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <motion.div key={title} variants={itemVariants}>
              <h4 className="text-sm font-semibold">{title}</h4>

              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <motion.li
                    key={link}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a
                      href={
                        link === "Features"
                          ? "/#features"
                          : link === "How It Works"
                            ? "/#how-it-works"
                            : link === "GitHub"
                              ? "https://github.com/Shuhel15"
                              : "#"
                      }
                      target={link === "GitHub" ? "_blank" : undefined}
                      rel={
                        link === "GitHub" ? "noopener noreferrer" : undefined
                      }
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            ease: "easeOut",
          }}
          className="mt-12 flex flex-col items-center justify-center gap-4 border-t border-border pt-6 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between"
        >
          <p>© {new Date().getFullYear()} DocMesh. All rights reserved.</p>
          <p className="items-center text-center justify-center">
            Made with
            <span className="mx-1 inline-flex items-center justify-center text-center animate-pulse gap-1 text-red-500">
              <FaHeart />
            </span>
            by Shuhel Ahmed
          </p>

          <div className="flex gap-5">
            <motion.a
              href="#"
              whileHover={{ y: -2 }}
              className="transition-colors hover:text-foreground"
            >
              Privacy
            </motion.a>

            <motion.a
              href="#"
              whileHover={{ y: -2 }}
              className="transition-colors hover:text-foreground"
            >
              Terms
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
