"use client";

import { FormEvent, useState } from "react";
import { Bot, Send, User, X, MessageCircle } from "lucide-react";

type ChatbotWidgetProps = {
  botId: string;
  chatbotName: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatbotWidget({
  botId,
  chatbotName,
}: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! How can I help you?",
    },
  ]);

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
      {isOpen && (
        <div className="absolute bottom-0 right-0 w-full max-w-105 h-full max-h-165 flex flex-col overflow-hidden rounded-[18px] bg-black text-white shadow-[0_20px_80px_rgba(0,0,0,0.45)] border border-white/10">
          {/* Header */}
          <div className="bg-zinc-900 relative z-10 flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex size-9 items-center justify-center
                  rounded-lg
                  border border-white/10
                  bg-white/5
                "
              >
                <Bot size={17} />
              </div>

              <div>
                <p className="text-sm font-semibold">{chatbotName}</p>

                <p className="text-[11px] text-white/50">AI Assistant</p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeChat}
              className=" rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-white
              "
              aria-label="Close chatbot"
            >
              <X size={18} />
            </button>
          </div>

          {/* Message before conversation */}
          <div className="relative z-10 flex-1 overflow-y-auto px-5 py-4">
            {messages.length === 1 && (
              <div className="flex min-h-full flex-col items-center justify-center text-center">
                <div className="flex p-2 items-center justify-center rounded-lg border border-white/10 bg-white/5 mb-4">
                  <Bot size={35} />
                </div>

                <h2 className="max-w-70 text-xl font-semibold">Hi there! 👋</h2>

                <p className="mt-3 max-w-65 text-sm leading-6 text-white/50">
                  Ask me anything about this company. I&lsquo;ll help you find the
                  information you need.
                </p>
              </div>
            )}

            {/* Messages after conversation starts */}
            {messages.length > 1 && (
              <div className="space-y-5">
                {messages.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2 ${
                      item.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {item.role === "assistant" && (
                      <div
                        className=" flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5
                        "
                      >
                        <Bot size={15} />
                      </div>
                    )}

                    <div
                      className={` max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-5
                        ${
                          item.role === "user"
                            ? "bg-white text-black"
                            : "border border-white/10 bg-white/5 text-white/90"
                        }
                      `}
                    >
                      {item.content}
                    </div>

                    {item.role === "user" && (
                      <div
                        className=" flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5
                        "
                      >
                        <User size={15} />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2">
                    <div
                      className=" flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5
                      "
                    >
                      <Bot size={15} />
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-white/50 animate-bounce" />
                        <span className="size-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:150ms]" />
                        <span className="size-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                    {error}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="relative z-10 px-4 pb-4 pt-3 border-t border-white/10">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <div
                className=" flex-1 rounded-2xl border border-white/10 bg-white/5 px-3 h-12 flex items-center
                "
              >
                <input
                  type="text"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Ask anything..."
                  disabled={isLoading}
                  className=" w-full h-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/35
                  "
                />
              </div>

              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className=" w-11 h-11 flex items-center justify-center rounded-2xl bg-white text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40
                "
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </form>

            <p className="mt-2 text-center text-[10px] text-white/30">
              Powered by Knowly
            </p>
          </div>
        </div>
      )}

      {/* floating button */}
      {!isOpen && (
        <div className="absolute bottom-4 right-4 ">
          <div
            className=" absolute inset-0 scale-150 rounded-full bg-white/10 blur-2xl
            "
          />
          <button
            type="button"
            onClick={openChat}
            className=" relative flex size-14 items-center justify-center rounded-full border border-white/10 bg-black text-white shadow-[0_0_50px_rgba(255,255,255,0.12)] transition hover:scale-105
            "
            aria-label={`Open ${chatbotName}`}
          >
            <MessageCircle size={22} />
          </button>
        </div>
      )}
    </div>
  );
}
