// import { ThemeToggle } from "@/components/theme/theme-toggle";

import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section id="#home" className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center px-6 text-center">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium text-muted-foreground">
            AI Chatbot Platform
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Turn your knowledge into an{" "}
            <span className="relative inline-block">
              AI chatbot.
              <svg
                className="pointer-events-none absolute -bottom-3 left-0 h-3 w-full"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 6 Q35 3 65 7 T125 6 T198 7"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.75"
                />
              </svg>
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Upload your documents, create a chatbot, and embed it directly into
            your website.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <button className="rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90">
              Build Your Chatbot
            </button>

            <button className="rounded-md border border-border px-6 py-3 font-medium hover:bg-muted">
              Learn More
            </button>
          </div>
        </div>
      </section>
      <HowItWorks/>
      <Features/>
    </main>
  );
}
