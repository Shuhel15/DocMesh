"use client";

import { useState } from "react";
import { Bot, Send, X, User } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import TypingIndicator from "./typingIndicator";

interface ChatPreviewProps {
  chatbotId: string;
  chatbotName: string;
}

export default function ChatPreview({
  chatbotId,
  chatbotName,
}: ChatPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const { messages, sendMessage, isLoading, error } = useChat(chatbotId);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const question = input;

    setInput("");

    await sendMessage(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Preview Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90 hover:scale-105 ease-in-out duration-200"
      >
        <Bot size={16} />
        Preview Chat
      </button>

      {/* Chat Preview */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-95 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-zinc-900">
            <div className="flex items-center gap-3 ">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-white">
                <Bot size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">{chatbotName}</p>
                <p className="text-xs text-zinc-500">Chat Preview</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="h-105 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <Bot
                    size={32}
                    className="mx-auto mb-3 text-muted-foreground"
                  />

                  <p className="text-sm font-medium">Test your chatbot</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Ask a question about your knowledge base.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const isUser = message.role === "user";

                  return (
                    <div
                      key={index}
                      className={`flex items-start gap-2 ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isUser && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted">
                          <Bot size={15} />
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                          isUser
                            ? "bg-foreground text-background"
                            : "border border-border bg-muted text-foreground"
                        }`}
                      >
                        {message.content}
                      </div>

                      {isUser && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted">
                          <User size={15} />
                        </div>
                      )}
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex justify-start">
                    <TypingIndicator />
                  </div>
                )}

                {error && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                    {error}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background p-1.5">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="Ask something..."
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
              />

              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                <Send size={16} className="group-hover:transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
          <p className="text-xs text-zinc-200 dark:text-zinc-700 text-center py-2">by Knowly</p>
        </div>
      )}
    </>
  );
}
