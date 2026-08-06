"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type EmbedCodeProps = {
  code: string;
};

export default function EmbedCode({ code }: EmbedCodeProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("COPY_EMBED_CODE_ERROR:", error);
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative rounded-lg bg-muted p-3 text-xs font-mono break-all text-foreground border border-border">
        {code}
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90
        hover:scale-105 ease-in-out duration-200"
      >
        {copied ? (
          <>
          <div className="text-green-500 flex flex-row gap-2 items-center">
            <Check size={16} />
           Copied!
           </div>
            
          </>
        ) : (
          <>
            <Copy size={16} />
            Copy Embed Code
          </>
        )}
      </button>
    </div>
  );
}