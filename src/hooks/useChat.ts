"use client";

import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatResponse {
  answer: string;
  conversationId: string;
}

export function useChat(chatbotId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (question: string) => {
    const trimmedQuestion = question.trim();

    // Don't send empty messages or if a request is already in progress
    if (!trimmedQuestion || isLoading) return;

    setError(null);

    //add user message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: trimmedQuestion,
      },
    ]);

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
        throw new Error(data.error || "Something went wrong");
      }

      const result: ChatResponse = data;

      // Save conversation id for next message
      setConversationId(result.conversationId);

      // assistant response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.answer,
        },
      ]);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
    error,
  };
}
