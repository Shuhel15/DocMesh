"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteChatbotButtonProps {
  chatbotId: string;
  chatbotName?: string;
  redirectTo?: string;
  onSuccess?: () => void;
  variant?: "default" | "icon";
}

export default function DeleteChatbotButton({
  chatbotId,
  chatbotName,
  redirectTo,
  onSuccess,
  variant = "default",
}: DeleteChatbotButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const displayName = chatbotName ? `"${chatbotName}"` : "this chatbot";
    const confirmed = window.confirm(
      `Are you sure you want to delete ${displayName}? All associated documents, conversations, and data will be permanently removed.`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/chatbots/${chatbotId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete chatbot");
      }

      if (onSuccess) {
        onSuccess();
      }

      if (redirectTo) {
        router.push(redirectTo);
        router.refresh();
      }
    } catch (error) {
      console.error("DELETE_CHATBOT_ERROR:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete chatbot. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        title="Delete Chatbot"
        className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-border bg-background text-muted-foreground transition-all duration-200 hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDeleting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Trash2 size={16} />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2 text-sm font-medium text-destructive transition-all duration-200 hover:bg-destructive hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isDeleting ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>Deleting...</span>
        </>
      ) : (
        <>
          <Trash2 size={16} />
          <span>Delete Bot</span>
        </>
      )}
    </button>
  );
}
