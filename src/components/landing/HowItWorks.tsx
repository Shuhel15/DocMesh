const steps = [
  {
    number: "01",
    title: "Create Your Chatbot",
    description:
      "Create a chatbot for your company or project in just a few clicks.",
  },
  {
    number: "02",
    title: "Add Your Knowledge",
    description:
      "Upload PDF, TXT, DOC, DOCX files or add your content manually.",
  },
  {
    number: "03",
    title: "AI Learns Your Data",
    description:
      "Your content is processed, chunked and converted into searchable knowledge.",
  },
  {
    number: "04",
    title: "Embed & Start Chatting",
    description:
      "Add your chatbot to any website using a simple embed script.",
  },
];

export default function HowItWorks() {
  return (
    <section className="border-t border-border bg-background px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            How It Works
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            From your knowledge to an AI chatbot.
          </h2>

          <p className="mt-5 text-muted-foreground">
            Build, train and embed your own AI chatbot in four simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group rounded-2xl border border-border bg-card p-6 hover:scale-105 hover:bg-muted/50 transition-all delay-80"
            >
              <span className="text-xl bg-black/10 px-2 border rounded-[7px] font-medium text-muted-foreground shadow-xl shadow-black/20">
                {step.number}
              </span>

              <h3 className="mt-8 text-xl font-semibold">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}