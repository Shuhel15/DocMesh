"use client";

import { useState } from "react";

type Theme = "black" | "white";

interface ThemeSelectorProps {
  chatbotId: string;
  currentTheme: Theme;
}

export default function ThemeSelector({
  chatbotId,
  currentTheme,
}: ThemeSelectorProps) {
  const [theme, setTheme] = useState<Theme>(currentTheme);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleThemeChange = async (newTheme: Theme) => {
    if (newTheme === theme || isUpdating) return;

    const previousTheme = theme;

    setTheme(newTheme);
    setIsUpdating(true);

    try {
      const response = await fetch("/api/chatbots/theme", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          botId: chatbotId,
          theme: newTheme,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update theme");
      }

      window.dispatchEvent(
        new CustomEvent("chatbot-theme-change", {
          detail: newTheme,
        }),
      );
    } catch (error) {
      console.error("Theme update error:", error);
      setTheme(previousTheme);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Chatbot Theme</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Choose how your chatbot will look.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Black Theme */}
        <button
          type="button"
          disabled={isUpdating}
          onClick={() => handleThemeChange("black")}
          className={`rounded-lg border p-4 text-left transition ${
            theme === "black"
              ? "border-foreground ring-1 ring-foreground"
              : "border-border hover:border-foreground/50"
          }`}
        >
          <div className="h-16 rounded-md bg-black border border-zinc-700 mb-3" />

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Black</span>

            {theme === "black" && (
              <span className="text-xs font-medium text-green-500">
                Selected
              </span>
            )}
          </div>
        </button>

        {/* White Theme */}
        <button
          type="button"
          disabled={isUpdating}
          onClick={() => handleThemeChange("white")}
          className={`rounded-lg border p-4 text-left transition ${
            theme === "white"
              ? "border-foreground ring-1 ring-foreground"
              : "border-border hover:border-foreground/50"
          }`}
        >
          <div className="h-16 rounded-md bg-white border border-zinc-300 mb-3" />

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">White</span>

            {theme === "white" && (
              <span className="text-xs font-medium text-green-500">
                Selected
              </span>
            )}
          </div>
        </button>
      </div>

      {isUpdating && (
        <p className="text-xs text-muted-foreground mt-3">Saving theme...</p>
      )}
    </div>
  );
}
