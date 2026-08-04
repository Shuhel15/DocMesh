"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import {
  Bot,
  Send,
  User,
  X,
  MessageSquare,
  RotateCcw,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/hooks/useChat";
import TypingIndicator from "./typingIndicator";

type ChatbotWidgetProps = {
  botId: string;
  chatbotName: string;
};

export default function ChatbotWidget({
  botId,
  chatbotName,
}: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, resetChat, isLoading, error } = useChat(botId);

  // Notify parent window (host site) when widget opens or closes
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.parent.postMessage(
        {
          type: "KNOWLY_CHATBOT_RESIZE",
          isOpen,
        },
        "*"
      );
    }
  }, [isOpen]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query || isLoading) return;

    setInput("");
    await sendMessage(query);
  };

  const handleCopyText = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const parseInlineFormatting = (str: string) => {
    const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
    const parts = str.split(regex);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        return (
          <a
            key={index}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:opacity-80"
          >
            {linkMatch[1]}
            <ExternalLink size={12} className="inline ml-0.5" />
          </a>
        );
      }
      return part;
    });
  };

  const renderFormattedContent = (text: string) => {
    const lines = text.split("\n");

    return (
      <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
        {lines.map((line, lIdx) => {
          if (!line.trim()) return <div key={lIdx} className="h-1" />;

          const isBullet =
            line.trim().startsWith("- ") || line.trim().startsWith("* ");
          const content = isBullet ? line.trim().substring(2) : line;

          if (isBullet) {
            return (
              <div key={lIdx} className="flex items-start gap-2 pl-1">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                <span>{parseInlineFormatting(content)}</span>
              </div>
            );
          }

          return <p key={lIdx}>{parseInlineFormatting(line)}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-end items-end antialiased font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-50 flex h-155 w-96 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-3.5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border-zinc-700 bg-zinc-800 text-white text-xs font-bold shadow-sm">
                  <Bot size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white leading-none">
                    {chatbotName}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Live Chat
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={resetChat}
                    className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                    title="Clear conversation"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                  aria-label="Close chatbot"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto bg-zinc-50/50 p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-6 px-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-md">
                    <Bot size={28} />
                  </div>
                  <p className="text-sm font-semibold text-zinc-900">
                    Test your chatbot!
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Ask a question to see how it answers using your documents.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((item, index) => {
                    const isUser = item.role === "user";
                    const isCopied = copiedIndex === index;

                    return (
                      <div
                        key={index}
                        className={`flex items-start gap-2.5 ${
                          isUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!isUser && (
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white text-xs font-bold shadow-sm mt-0.5">
                            <Bot size={14} />
                          </div>
                        )}

                        <div className="group relative max-w-[82%]">
                          <div
                            className={`rounded-2xl px-3.5 py-2.5 ${
                              isUser
                                ? "bg-zinc-800 text-white shadow-md rounded-tr-xs"
                                : "bg-white border border-zinc-200/80 text-zinc-900 shadow-sm rounded-tl-xs"
                            }`}
                          >
                            {isUser ? (
                              <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                                {item.content}
                              </p>
                            ) : (
                              renderFormattedContent(item.content)
                            )}
                          </div>

                          <div
                            className={`flex items-center gap-2 mt-1 px-1 text-[10px] text-zinc-400 ${
                              isUser ? "justify-end" : "justify-start"
                            }`}
                          >
                            {item.timestamp && <span>{item.timestamp}</span>}

                            {!isUser && (
                              <button
                                type="button"
                                onClick={() => handleCopyText(item.content, index)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                                title="Copy answer"
                              >
                                {isCopied ? (
                                  <Check size={12} className="text-emerald-500" />
                                ) : (
                                  <Copy size={12} />
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        {isUser && (
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold bg-zinc-900 text-white mt-0.5 border border-zinc-700">
                            <User size={14} />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {isLoading && (
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white text-xs font-bold shadow-sm mt-0.5">
                        <Bot size={14} />
                      </div>
                      <TypingIndicator />
                    </div>
                  )}

                  {error && (
                    <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-3 text-xs text-red-600 dark:text-red-400">
                      <p className="font-semibold mb-1">Error</p>
                      <p>{error}</p>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Bar */}
              <div className="border-t border-zinc-200 bg-white p-3">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <div className="relative flex flex-1 items-center rounded-xl border border-zinc-200 bg-zinc-50 transition-all focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="w-full bg-transparent px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 outline-none disabled:opacity-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-400 bg-white text-zinc-900 transition-all hover:opacity-90 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </form>

              <p className="text-[10px] text-zinc-400 text-center mt-2">
                Powered by <span className="font-semibold text-zinc-600">Knowly AI</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Launcher Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl focus:outline-none"
          aria-label={`Open ${chatbotName}`}
        >
          <span className="absolute inset-0 rounded-full bg-blue-500/40 animate-ping" />
          <div className="relative flex items-center justify-center">
            <MessageSquare size={26} />
          </div>
        </motion.button>
      )}
    </div>
  );
}