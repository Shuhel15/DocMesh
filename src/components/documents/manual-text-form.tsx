"use client";

import { useState } from "react";
import { FileText, Loader2, Save } from "lucide-react";

interface ManualTextFormProps {
  chatbotId: string;
}

export default function ManualTextForm({
  chatbotId,
}: ManualTextFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!content.trim()) {
      setError("Please enter some knowledge.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();

      formData.append("chatbotId", chatbotId);
      formData.append("title", title);
      formData.append("content", content);

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save knowledge"
        );
      }

      setMessage("Knowledge saved successfully.");
      setTitle("");
      setContent("");

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-6 rounded-lg border border-border p-4">
      <div className="mb-4 flex items-center gap-2">
        <FileText
          size={18}
          className="text-muted-foreground"
        />

        <div>
          <h3 className="text-sm font-semibold">
            Add Knowledge Manually
          </h3>

          <p className="text-xs text-muted-foreground">
            Add information directly to this chatbot&lsquo;s knowledge base.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label
            htmlFor="knowledge-title"
            className="mb-1.5 block text-xs font-medium"
          >
            Title
          </label>

          <input
            id="knowledge-title"
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setError("");
            }}
            placeholder="Company Information"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-foreground"
          />
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="knowledge-content"
            className="mb-1.5 block text-xs font-medium"
          >
            Content
          </label>

          <textarea
            id="knowledge-content"
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              setError("");
            }}
            placeholder="Our company provides web development services..."
            rows={8}
            className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-foreground"
          />
        </div>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50
          hover:scale-105 ease-in-out duration-200"
        >
          {saving ? (
            <>
              <Loader2
                size={16}
                className="animate-spin"
              />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Knowledge
            </>
          )}
        </button>

        {message && (
          <p className="text-sm text-green-600">
            {message}
          </p>
        )}

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}