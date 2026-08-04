"use client";

import { useState } from "react";
import { Pencil, Loader2, Save, X } from "lucide-react";

interface EditDocumentModalProps {
  documentId: string;
  chatbotId: string;
  initialTitle: string;
  initialContent: string;
}

export default function EditDocumentModal({
  documentId,
  chatbotId,
  initialTitle,
  initialContent,
}: EditDocumentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleOpen = () => {
    setTitle(initialTitle);
    setContent(initialContent);
    setError("");
    setIsOpen(true);
  };

  const handleClose = () => {
    if (isSaving) return;
    setIsOpen(false);
    setError("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!content.trim()) {
      setError("Please enter content.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/documents", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId,
          chatbotId,
          title: title.trim(),
          content: content.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update document");
      }

      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition hover:border-foreground hover:text-foreground"
      >
        <Pencil size={14} />
        Edit
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl text-card-foreground space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-semibold">Edit Knowledge Document</h3>
              <button
                type="button"
                onClick={handleClose}
                disabled={isSaving}
                className="rounded-md p-1 text-muted-foreground hover:text-foreground transition disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label
                  htmlFor={`edit-title-${documentId}`}
                  className="mb-1.5 block text-xs font-medium"
                >
                  Title
                </label>
                <input
                  id={`edit-title-${documentId}`}
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setError("");
                  }}
                  placeholder="Document Title"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-foreground"
                />
              </div>

              <div>
                <label
                  htmlFor={`edit-content-${documentId}`}
                  className="mb-1.5 block text-xs font-medium"
                >
                  Content
                </label>
                <textarea
                  id={`edit-content-${documentId}`}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setError("");
                  }}
                  placeholder="Document Content"
                  rows={8}
                  className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-foreground"
                />
              </div>

              {error && (
                <p className="text-xs text-red-500 font-medium">{error}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSaving}
                  className="rounded-lg border border-border px-4 py-2 text-xs font-medium transition hover:bg-muted disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-background transition hover:opacity-90 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
