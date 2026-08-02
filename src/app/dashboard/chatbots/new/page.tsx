"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewChatbotPage() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/chatbots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        return;
      }

      console.log("Chatbot created:", data.chatbot);

      router.push(`/dashboard/chatbots/${data.chatbot.id}`);
    } catch (error) {
      console.error("CREATE_CHATBOT_ERROR:", error);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-30">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/dashboard/chatbots"
            className="mb-6 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to Chatbots
          </Link>

          <h1 className="text-3xl font-semibold tracking-tight">
            Create your AI chatbot
          </h1>

          <p className="mt-2 text-muted-foreground">
            Give your chatbot a name to get started.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleCreate} className="space-y-6">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Chatbot Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Customer Support Bot"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
            <Link
              href="/dashboard/chatbots"
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={!name.trim()}
              className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Create Chatbot
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
