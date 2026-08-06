"use client";

import { useState, useCallback } from "react";

export interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  answer: string;
  conversationId: string;
  sources?: Array<{
    documentId: string;
    documentName: string;
    chunkIndex: number;
  }>;
}

export function useChat(chatbotId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to send a message to the chatbot and receive a response
  const sendMessage = useCallback(
    async (question: string) => {
      const trimmedQuestion = question.trim();

      if (!trimmedQuestion || isLoading) return;

      setError(null);

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: trimmedQuestion,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatbotId,
            conversationId,
            question: trimmedQuestion,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch response");
        }

        const result: ChatResponse = data;

        setConversationId(result.conversationId);

        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: result.answer,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        console.error("CHAT_ERROR:", err);
        setError(
          err instanceof Error ? err.message : "Something went wrong. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [chatbotId, conversationId, isLoading]
  );

  const resetChat = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  }, []);

  return {
    messages,
    sendMessage,
    resetChat,
    isLoading,
    error,
    conversationId,
  };
}

