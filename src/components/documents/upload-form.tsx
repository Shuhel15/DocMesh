"use client";

import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";

interface UploadFormProps {
  chatbotId: string;
}

export default function UploadForm({
  chatbotId,
}: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }

    setUploading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("chatbotId", chatbotId);

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setMessage("Document uploaded successfully.");
      setFile(null);

      // Refresh server component data
      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-6 rounded-lg border border-border p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <label className="group flex-1 cursor-pointer rounded-lg border border-dashed border-border p-4 text-center transition hover:bg-muted">
          <Upload
            size={20}
            className="mx-auto mb-2 text-muted-foreground transition-transform group-hover:-translate-y-1"
          />

          <p className="text-sm font-medium">
            {file ? file.name : "Choose a document"}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            PDF, TXT, DOC or DOCX
          </p>

          <input
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            className="hidden"
            onChange={(event) => {
              const selectedFile = event.target.files?.[0];

              if (selectedFile) {
                setFile(selectedFile);
                setMessage("");
                setError("");
              }
            }}
          />
        </label>

        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || uploading}
          className="group inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={16} className="transition-transform group-hover:-translate-y-1" />
              Upload
            </>
          )}
        </button>
      </div>

      {message && (
        <p className="mt-3 text-sm text-green-600">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}