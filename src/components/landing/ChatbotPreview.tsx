import { MoveUp } from "lucide-react";

const messages = [
  {
    role: "user",
    text: "What can you help me with?",
  },
  {
    role: "assistant",
    text: "I can answer questions using your knowledge base.",
  },
];

function ChatPreview({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`w-full overflow-hidden rounded-2xl border shadow-2xl ${
        dark
          ? "border-zinc-700 bg-zinc-950 text-white"
          : "border-zinc-200 bg-white text-black"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center gap-3 border-b px-4 py-4 sm:px-5 ${
          dark ? "border-zinc-800" : "border-zinc-200"
        }`}
      >
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
            dark ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          AI
        </div>

        <div>
          <p className="text-sm font-semibold">AI Assistant</p>

          <p className="text-xs text-zinc-500">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-4 p-4 sm:p-5">
        {messages.map((message, index) => {
          const isUser = message.role === "user";

          return (
            <div
              key={index}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2.5 text-xs leading-5 sm:px-4 sm:py-3 ${
                  isUser
                    ? dark
                      ? "bg-white text-black"
                      : "bg-black text-white"
                    : dark
                      ? "bg-zinc-900 text-zinc-300"
                      : "bg-zinc-100 text-zinc-700"
                }`}
              >
                {message.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-3 sm:p-4">
        <div
          className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 sm:px-4 sm:py-3 ${
            dark ? "border-zinc-800 bg-zinc-900" : "border-zinc-200 bg-zinc-50"
          }`}
        >
          <span
            className={`truncate text-xs ${
              dark ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            Ask anything...
          </span>

          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs ${
              dark ? "bg-white text-black" : "bg-black text-white"
            }`}
          >
           <MoveUp size={17} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatbotPreview() {
  return (
    <section className="overflow-hidden px-4 py-16 sm:px-6 sm:py-15">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-sm sm:tracking-widest">
            Chatbot Themes
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:mt-4 sm:text-5xl">
            Designed to fit your website.
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:mt-5 sm:text-base">
            Choose between a clean light or dark experience for your visitors.
          </p>
        </div>

        {/* Chatbot Previews */}
        <div
          className=" relative mx-auto mt-12 flex max-w-5xl flex-col items-center gap-8 sm:mt-16 sm:flex-row sm:justify-center sm:gap-0 lg:mt-20
          "
        >
          {/* Light */}
          <div
            className=" relative z-10 w-full max-w-95 sm:w-[50%] sm:max-w-90 sm:translate-x-5 sm:rotate-[4deg] lg:w-[48%] lg:max-w-95 lg:translate-x-8 lg:rotate-[5deg]
            hover:scale-105 delay-75 transform transition duration-300 ease-in-out"
          >
            <ChatPreview />
          </div>

          {/* Dark */}
          <div
            className=" relative z-10 w-full max-w-95 sm:w-[50%] sm:max-w-90 sm:-translate-x-5 sm:rotate-[-4deg] lg:w-[48%] lg:max-w-95 lg:-translate-x-8 lg:rotate-[-5deg]
            hover:scale-105 delay-75 transform transition duration-300 ease-in-out"
          >
            <ChatPreview dark />
          </div>
        </div>
      </div>
    </section>
  );
}
