"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

interface DeleteDocumentButtonProps {
  documentId: string;
  chatbotId: string;
}

export default function DeleteDocumentButton({
  documentId,
  chatbotId,
}: DeleteDocumentButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?",
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/documents?id=${documentId}&chatbotId=${chatbotId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete document");
      }

      // Refresh server component data
      window.location.reload();
    } catch (error) {
      console.error("DELETE_DOCUMENT_ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete document",
      );

      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition hover:border-destructive hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Trash2 size={14} />

      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}