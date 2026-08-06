"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import { Bot, User, X, MessageCircle, MoveUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ChatbotWidgetProps = {
  botId: string;
  chatbotName: string;
  theme: "black" | "white";
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatbotWidget({
  botId,
  chatbotName,
  theme,
}: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const isBlack = theme === "black";
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when messages change or when the chat is opened
  useEffect(() => {
    if (!messagesEndRef.current) return;

    // Smooth scroll to the latest message
    messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isOpen]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const question = message.trim();

    if (!question || isLoading) {
      return;
    }

    setError(null);

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: question,
      },
    ]);

    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatbotId: botId,
          conversationId,
          question,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setConversationId(data.conversationId);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (error) {
      console.error("EMBED_CHAT_ERROR:", error);

      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  function openChat() {
    setIsOpen(true);
//this is for resizing the iframe when the chat is opened. It sends a message to the parent window to resize the iframe to fit the chat widget.
    window.parent.postMessage(
      {
        type: "KNOWLY_CHATBOT_RESIZE",
        isOpen: true,
      },
      "*",
    );
  }

  function closeChat() {
    setIsOpen(false);
//this is for resizing the iframe when the chat is closed. It sends a message to the parent window to resize the iframe to fit the chat widget.
    window.parent.postMessage(
      {
        type: "KNOWLY_CHATBOT_RESIZE",
        isOpen: false,
      },
      "*",
    );
  }

  return (
    <div className="fixed inset-0 bg-transparent">
      {/* Chat Window */}
      {isOpen && (
        <div
          className={`absolute bottom-0 right-0 w-full max-w-105 h-full max-h-165 flex flex-col overflow-hidden rounded-[18px] shadow-[0_20px_80px_rgba(0,0,0,0.45)] border ${
            isBlack
              ? "bg-black text-white border-white/10"
              : "bg-white text-zinc-900 border-zinc-200"
          }`}
        >
          {/* Header */}
          <div
            className={`relative z-10 flex items-center justify-between px-5 py-4 border-b ${
              isBlack
                ? "bg-zinc-900 border-white/10"
                : "bg-white border-zinc-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex size-9 items-center justify-center rounded-lg border ${
                  isBlack
                    ? "border-white/10 bg-white/5"
                    : "border-zinc-200 bg-zinc-100"
                }`}
              >
                <Bot size={17} />
              </div>

              <div>
                <p className="text-sm font-semibold">{chatbotName}</p>

                <p
                  className={`text-[11px] ${
                    isBlack ? "text-white/50" : "text-zinc-500"
                  }`}
                >
                  AI Assistant
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeChat}
              className={`rounded-lg p-2 transition ${
                isBlack
                  ? "text-white/60 hover:bg-white/10 hover:text-white"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
              aria-label="Close chatbot"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div
            className={`relative z-10 flex-1 overflow-y-auto px-5 py-4 ${
              isBlack ? "bg-black" : "bg-zinc-50"
            }`}
          >
            {/* Before Message*/}
            <div className="space-y-5 ">
              {messages.length === 0 ? (
                <div className="flex min-h-full flex-col items-center justify-center text-center mt-30">
                  <div
                    className={`mb-4 flex rounded-lg border p-2 ${
                      isBlack
                        ? "border-white/10 bg-white/5"
                        : "border-zinc-200 bg-white"
                    }`}
                  >
                    <Bot size={35} />
                  </div>

                  <h2 className="max-w-70 text-xl font-semibold">
                    Hi there! 👋
                  </h2>

                  <p
                    className={`mt-3 max-w-65 text-sm leading-6 ${
                      isBlack ? "text-white/50" : "text-zinc-500"
                    }`}
                  >
                    Ask me anything about this company. I&lsquo;ll help you find
                    the information you need.
                  </p>
                </div>
              ) : (
                messages.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2 ${
                      item.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Assistant Avatar */}
                    {item.role === "assistant" && (
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full border ${
                          isBlack
                            ? "border-white/10 bg-white/5"
                            : "border-zinc-200 bg-white"
                        }`}
                      >
                        <Bot size={15} />
                      </div>
                    )}

                    {/* Message */}
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-5 ${
                        item.role === "user"
                          ? isBlack
                            ? "bg-white text-black"
                            : "bg-zinc-900 text-white"
                          : isBlack
                            ? "border border-white/10 bg-white/5 text-white/90"
                            : "border border-zinc-200 bg-white text-zinc-900"
                      }`}
                    >
                      {item.role === "assistant" ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => (
                              <p className="mb-3 last:mb-0 leading-6">
                                {children}
                              </p>
                            ),

                            strong: ({ children }) => (
                              <strong className="font-semibold">
                                {children}
                              </strong>
                            ),

                            em: ({ children }) => (
                              <em className="italic">{children}</em>
                            ),

                            ul: ({ children }) => (
                              <ul className="list-disc space-y-1 pl-5 mb-3">
                                {children}
                              </ul>
                            ),

                            ol: ({ children }) => (
                              <ol className="list-decimal space-y-1 pl-5 mb-3">
                                {children}
                              </ol>
                            ),

                            li: ({ children }) => (
                              <li className="leading-6">{children}</li>
                            ),

                            a: ({ href, children }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`underline underline-offset-2 transition ${
                                  isBlack
                                    ? "text-blue-400 hover:text-blue-300"
                                    : "text-blue-600 hover:text-blue-700"
                                }`}
                              >
                                {children}
                              </a>
                            ),

                            code: ({ children }) => (
                              <code
                                className={`rounded px-1.5 py-0.5 font-mono text-[13px] ${
                                  isBlack
                                    ? "bg-zinc-800 text-zinc-100"
                                    : "bg-zinc-200 text-zinc-900"
                                }`}
                              >
                                {children}
                              </code>
                            ),
                          }}
                        >
                          {item.content}
                        </ReactMarkdown>
                      ) : (
                        item.content
                      )}
                    </div>

                    {/* User Avatar */}
                    {item.role === "user" && (
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full border ${
                          isBlack
                            ? "border-white/10 bg-white/5"
                            : "border-zinc-200 bg-zinc-100"
                        }`}
                      >
                        <User size={15} />
                      </div>
                    )}
                  </div>
                ))
              )}

              {/*  Typing Indicator */}
              {isLoading && (
                <div className="flex items-center gap-2">
                  <div
                    className={`flex size-8 items-center justify-center rounded-full border ${
                      isBlack
                        ? "border-white/10 bg-white/5"
                        : "border-zinc-200 bg-white"
                    }`}
                  >
                    <Bot size={15} />
                  </div>

                  <div
                    className={`rounded-2xl border px-4 py-3 ${
                      isBlack
                        ? "border-white/10 bg-white/5"
                        : "border-zinc-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span
                        className={`size-1.5 animate-bounce rounded-full ${
                          isBlack ? "bg-white/50" : "bg-zinc-400"
                        }`}
                      />

                      <span
                        className={`size-1.5 animate-bounce rounded-full [animation-delay:150ms] ${
                          isBlack ? "bg-white/50" : "bg-zinc-400"
                        }`}
                      />

                      <span
                        className={`size-1.5 animate-bounce rounded-full [animation-delay:300ms] ${
                          isBlack ? "bg-white/50" : "bg-zinc-400"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    isBlack
                      ? "border-white/10 bg-white/5 text-white/70"
                      : "border-red-200 bg-red-50 text-red-600"
                  }`}
                >
                  {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div
            className={`relative z-10 border-t px-4 pb-4 pt-3 ${
              isBlack ? "border-white/10 bg-black" : "border-zinc-200 bg-white"
            }`}
          >
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <div
                className={`flex h-12 flex-1 items-center rounded-2xl border px-3 ${
                  isBlack
                    ? "border-white/10 bg-white/5"
                    : "border-zinc-200 bg-zinc-50"
                }`}
              >
                <input
                  type="text"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Ask anything..."
                  disabled={isLoading}
                  className={`h-full w-full min-w-0 bg-transparent text-sm outline-none ${
                    isBlack
                      ? "text-white placeholder:text-white/35"
                      : "text-zinc-900 placeholder:text-zinc-400"
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 ${
                  isBlack ? "bg-white text-black" : "bg-zinc-900 text-white"
                }`}
                aria-label="Send message"
              >
                <MoveUp size={20} />
              </button>
            </form>

            <p
              className={`mt-2 text-center text-[10px] ${
                isBlack ? "text-white/30" : "text-zinc-400"
              }`}
            >
              Powered by Knowly
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <div className="absolute bottom-4 right-4">
          <button
            type="button"
            onClick={openChat}
            className={`relative flex size-14 items-center justify-center rounded-full border transition hover:scale-105 ${
              isBlack
                ? "border-white/10 bg-black text-white"
                : "border-zinc-200 bg-white text-zinc-900"
            }`}
            aria-label={`Open ${chatbotName}`}
          >
            <MessageCircle size={22} />
          </button>
        </div>
      )}
    </div>
  );
}
