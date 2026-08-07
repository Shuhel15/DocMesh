/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, User } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import TypingIndicator from "./typingIndicator";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

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
  
  const [theme, setTheme] = useState<"black" | "white">(currentTheme);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, isLoading, error } = useChat(chatbotId);

  // Handle theme changes
  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme]);

  // Listen for theme change events from the parent component
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

  // Use effect for scrolling to the bottom of the chat when new messages are added or when the chat is opened
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

  // Handle sending messages
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const question = input.trim();
    setInput("");
    await sendMessage(question);
  };

  // Handle pressing Enter to send a message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
          className={`fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 flex h-155 max-h-[calc(100vh-2rem)] w-[calc(100vw-1.5rem)] sm:w-96 flex-col overflow-hidden rounded-2xl border shadow-2xl ${
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
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeSanitize]}
                              components={{
                                p: ({ children }) => (
                                  <p className="mb-2 text-xs leading-relaxed sm:text-sm">
                                    {children}
                                  </p>
                                ),

                                ul: ({ children }) => (
                                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                                    {children}
                                  </ul>
                                ),

                                ol: ({ children }) => (
                                  <ol className="list-decimal pl-5 space-y-1 text-xs sm:text-sm">
                                    {children}
                                  </ol>
                                ),

                                li: ({ children }) => <li>{children}</li>,

                                strong: ({ children }) => (
                                  <strong className="font-semibold">
                                    {children}
                                  </strong>
                                ),

                                a: ({ href, children }) => (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                  >
                                    {children}
                                  </a>
                                ),

                                code: ({ children }) => (
                                  <code className="rounded bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 text-xs">
                                    {children}
                                  </code>
                                ),
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          )}
                        </div>

                        <div
                          className={`mt-1 flex items-center gap-2 px-1 text-[10px] ${
                            isBlack ? "text-zinc-500" : "text-zinc-400"
                          } ${isUser ? "justify-end" : "justify-start"}`}
                        />
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
                DocMesh
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
