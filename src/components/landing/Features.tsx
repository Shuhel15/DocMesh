const features = [
  {
    number: "01",
    title: "Document Upload",
    description:
      "Upload PDF, TXT, DOC or DOCX files and turn your existing content into chatbot knowledge.",
  },
  {
    number: "02",
    title: "Manual Knowledge",
    description:
      "Don't have a document? Add your company's knowledge manually with simple text input.",
  },
  {
    number: "03",
    title: "Smart RAG",
    description:
      "The chatbot retrieves relevant information from your knowledge base before generating an answer.",
  },
  {
    number: "04",
    title: "Easy Embed",
    description:
      "Add your chatbot to any website using a lightweight embed script.",
  },
];

export default function Features() {
  return (
    <section className="border-t border-border bg-muted/30 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Features
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            Everything you need to build an AI chatbot.
          </h2>

          <p className="mt-5 text-muted-foreground">
            Powerful features to turn your business knowledge into a
            useful AI assistant.
          </p>
        </div>

        {/* Features */}
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.number}
              className="bg-background p-8 transition-colors hover:bg-muted/50"
            >
              <span className="text-xl bg-black/10 px-2 border rounded-[7px] font-medium text-muted-foreground shadow-xl shadow-black/20">
                {feature.number}
              </span>

              <h3 className="mt-10 text-2xl font-semibold">
                {feature.title}
              </h3>

              <p className="mt-4 max-w-md leading-7 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}