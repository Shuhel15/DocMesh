/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  X,
  User,
  RotateCcw,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { useChat } from "@/hooks/useChat";
import TypingIndicator from "./typingIndicator";

interface ChatPreviewProps {
  chatbotId: string;
  chatbotName: string;
  currentTheme: "black" | "white";
}

export default function ChatPreview({
  chatbotId,
  chatbotName,
  currentTheme,
}: ChatPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [theme, setTheme] = useState<"black" | "white">(currentTheme);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, resetChat, isLoading, error } =
    useChat(chatbotId);

  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<"black" | "white">;
      setTheme(customEvent.detail);
    };

    window.addEventListener("chatbot-theme-change", handleThemeChange);

    return () => {
      window.removeEventListener("chatbot-theme-change", handleThemeChange);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const question = input.trim();
    setInput("");
    await sendMessage(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyText = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const parseInlineFormatting = (str: string) => {
    const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
    const parts = str.split(regex);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong
            key={index}
            className={`font-semibold ${
              theme === "black" ? "text-white" : "text-zinc-900"
            }`}
          >
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
          if (!line.trim()) {
            return <div key={lIdx} className="h-1" />;
          }

          const isBullet =
            line.trim().startsWith("- ") || line.trim().startsWith("* ");

          const content = isBullet ? line.trim().substring(2) : line;

          if (isBullet) {
            return (
              <div key={lIdx} className="flex items-start gap-2 pl-1">
                <span
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                    theme === "black" ? "bg-zinc-400" : "bg-zinc-500"
                  }`}
                />

                <span>{parseInlineFormatting(content)}</span>
              </div>
            );
          }

          return <p key={lIdx}>{parseInlineFormatting(line)}</p>;
        })}
      </div>
    );
  };

  const isBlack = theme === "black";

  return (
    <>
      {/* Preview Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90 hover:scale-105 ease-in-out duration-200 shadow-sm"
      >
        <Bot size={16} />
        Preview Chatbot
      </button>

      {/* Chat Preview */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex h-155 w-96 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border shadow-2xl ${
            isBlack
              ? "border-zinc-800 bg-zinc-950 text-white"
              : "border-zinc-200 bg-white text-zinc-900"
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between border-b px-4 py-3.5 ${
              isBlack
                ? "border-zinc-800 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white text-zinc-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-bold shadow-sm ${
                  isBlack
                    ? "border-zinc-700 bg-zinc-800 text-white"
                    : "border-zinc-200 bg-zinc-100 text-zinc-900"
                }`}
              >
                <Bot size={18} />
              </div>

              <div>
                <p
                  className={`text-sm font-semibold leading-none ${
                    isBlack ? "text-white" : "text-zinc-900"
                  }`}
                >
                  {chatbotName}
                </p>

                <p className="mt-1 text-xs text-zinc-500">Live Preview</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={resetChat}
                  className={`rounded-lg p-1.5 transition ${
                    isBlack
                      ? "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                  title="Clear conversation"
                >
                  <RotateCcw size={16} />
                </button>
              )}

              <button
                onClick={() => setIsOpen(false)}
                className={`rounded-lg p-1.5 transition ${
                  isBlack
                    ? "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className={`flex-1 overflow-y-auto p-4 space-y-4 ${
              isBlack ? "bg-zinc-950" : "bg-zinc-50"
            }`}
          >
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center px-2 py-6 text-center">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl border shadow-md ${
                    isBlack
                      ? "border-zinc-700 bg-zinc-800 text-white"
                      : "border-zinc-200 bg-zinc-100 text-zinc-900"
                  }`}
                >
                  <Bot size={28} />
                </div>

                <p
                  className={`mt-3 text-sm font-semibold ${
                    isBlack ? "text-zinc-100" : "text-zinc-900"
                  }`}
                >
                  Test your chatbot!
                </p>

                <p
                  className={`mt-1 text-xs ${
                    isBlack ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  Ask a question to see how it answers using your documents.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const isUser = message.role === "user";
                  const isCopied = copiedIndex === index;

                  return (
                    <div
                      key={index}
                      className={`flex items-start gap-2.5 ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isUser && (
                        <div
                          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold shadow-sm ${
                            isBlack
                              ? "bg-zinc-800 text-white"
                              : "border border-zinc-200 bg-zinc-100 text-zinc-900"
                          }`}
                        >
                          <Bot size={14} />
                        </div>
                      )}

                      <div className="group relative max-w-[82%]">
                        <div
                          className={`rounded-2xl px-3.5 py-2.5 ${
                            isUser
                              ? isBlack
                                ? "rounded-tr-xs bg-zinc-800 text-white shadow-md"
                                : "rounded-tr-xs bg-zinc-200 text-zinc-900 shadow-sm"
                              : isBlack
                                ? "rounded-tl-xs border border-zinc-800 bg-zinc-900 text-zinc-100 shadow-sm"
                                : "rounded-tl-xs border border-zinc-200 bg-white text-zinc-900 shadow-sm"
                          }`}
                        >
                          {isUser ? (
                            <p className="whitespace-pre-wrap text-xs leading-relaxed sm:text-sm">
                              {message.content}
                            </p>
                          ) : (
                            renderFormattedContent(message.content)
                          )}
                        </div>

                        <div
                          className={`mt-1 flex items-center gap-2 px-1 text-[10px] ${
                            isBlack ? "text-zinc-500" : "text-zinc-400"
                          } ${isUser ? "justify-end" : "justify-start"}`}
                        >
                          {message.timestamp && (
                            <span>{message.timestamp}</span>
                          )}

                          {!isUser && (
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyText(message.content, index)
                              }
                              className={`p-0.5 opacity-0 transition-opacity group-hover:opacity-100 ${
                                isBlack
                                  ? "text-zinc-500 hover:text-zinc-200"
                                  : "text-zinc-400 hover:text-zinc-600"
                              }`}
                              title="Copy answer"
                            >
                              {isCopied ? (
                                <Check
                                  size={12}
                                  className="text-emerald-500"
                                />
                              ) : (
                                <Copy size={12} />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {isUser && (
                        <div
                          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                            isBlack
                              ? "border border-zinc-700 bg-zinc-900 text-white"
                              : "border border-zinc-200 bg-zinc-100 text-zinc-900"
                          }`}
                        >
                          <User size={14} />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Loading */}
                {isLoading && (
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold shadow-sm ${
                        isBlack
                          ? "bg-zinc-800 text-white"
                          : "border border-zinc-200 bg-zinc-100 text-zinc-900"
                      }`}
                    >
                      <Bot size={14} />
                    </div>

                    <TypingIndicator />
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                    <p className="mb-1 font-semibold">Error</p>
                    <p>{error}</p>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div
            className={`border-t p-3 ${
              isBlack
                ? "border-zinc-800 bg-zinc-950"
                : "border-zinc-200 bg-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`relative flex flex-1 items-center rounded-xl border transition-all ${
                  isBlack
                    ? "border-zinc-800 bg-zinc-900/80 focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500"
                    : "border-zinc-200 bg-zinc-50 focus-within:border-zinc-400 focus-within:ring-1 focus-within:ring-zinc-400"
                }`}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  placeholder="Ask something..."
                  className={`w-full bg-transparent px-3.5 py-2.5 text-xs outline-none disabled:opacity-50 sm:text-sm ${
                    isBlack
                      ? "text-zinc-100 placeholder:text-zinc-500"
                      : "text-zinc-900 placeholder:text-zinc-400"
                  }`}
                />
              </div>

              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all hover:scale-105 hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:scale-100 disabled:opacity-40 ${
                  isBlack
                    ? "border-zinc-700 bg-zinc-900 text-white"
                    : "border-zinc-300 bg-zinc-100 text-zinc-900"
                }`}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>

            <p
              className={`mt-2 text-center text-[10px] ${
                isBlack ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Powered by{" "}
              <span
                className={`font-semibold ${
                  isBlack ? "text-zinc-300" : "text-zinc-600"
                }`}
              >
                Knowly AI
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}