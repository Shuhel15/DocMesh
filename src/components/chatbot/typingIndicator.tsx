"use client";

export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl bg-neutral-200 dark:bg-neutral-800 px-4 py-3">
        <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-500 [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-500 [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-500" />
      </div>
    </div>
  );
}