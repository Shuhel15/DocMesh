import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bot, FileText, Code2 } from "lucide-react";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import UploadForm from "@/components/documents/upload-form";
import ManualTextForm from "@/components/documents/manual-text-form";
import ChatPreview from "@/components/chatbot/chat-preview";
import DeleteDocumentButton from "@/components/documents/delete-document-button";
import EditDocumentModal from "@/components/documents/edit-document-modal";
import EmbedCode from "@/components/chatbot/embed-code";

interface ChatbotPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ChatbotDetailPage({ params }: ChatbotPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;

  // find user's company
  const company = await prisma.company.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  if (!company) {
    redirect("/dashboard");
  }

  // fetch the chatbot for this company
  const chatbot = await prisma.chatbot.findFirst({
    where: {
      id,
      companyId: company.id,
    },
    include: {
      documents: {
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          conversations: true,
          chunks: true,
        },
      },
    },
  });

  if (!chatbot) {
    notFound();
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const embedScript = `<script
  src="${baseUrl}/embed/chatbot.js"
  data-bot-id="${chatbot.id}"
></script>`;

  return (
    <main className="min-h-screen bg-background text-foreground pt-24 pb-12 px-6">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard/chatbots"
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground mb-6"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Chatbots
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted text-foreground">
              <Bot size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {chatbot.name}
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Created on {new Date(chatbot.createdAt).toLocaleDateString()}{" "}
                <br />
                ID: {chatbot.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-border text-white bg-green-500 dark:bg-green-600 px-3 py-1 text-xs font-medium">
              Active
            </span>

            <ChatPreview chatbotId={chatbot.id} chatbotName={chatbot.name} />
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <FileText size={18} />
                    Knowledge Base Documents
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {chatbot.documents.length} document(s) uploaded
                  </p>
                </div>
              </div>

              {/* file upload */}
              <UploadForm chatbotId={chatbot.id} />
              {/* manula text area  */}
              <ManualTextForm chatbotId={chatbot.id} />

              {chatbot.documents.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-8 text-center mt-4">
                  <FileText
                    size={28}
                    className="mx-auto text-muted-foreground mb-2"
                  />
                  <p className="text-sm font-medium">No documents added yet</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Upload documents (PDF, TXT, DOCX) to train this chatbot with
                    your specific business data.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border mt-4">
                  {chatbot.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="py-3 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {doc.name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Type: {doc.type} <br />
                          Date: {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {doc.type === "text" && (
                          <EditDocumentModal
                            documentId={doc.id}
                            chatbotId={chatbot.id}
                            initialTitle={doc.name}
                            initialContent={doc.content || ""}
                          />
                        )}
                        <DeleteDocumentButton
                          documentId={doc.id}
                          chatbotId={chatbot.id}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-xs text-muted-foreground">
                  Total Conversations
                </p>
                <p className="text-2xl font-bold mt-2">
                  {chatbot._count.conversations}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-xs text-muted-foreground">
                  Knowledge Chunks
                </p>
                <p className="text-2xl font-bold mt-2">
                  {chatbot._count.chunks}
                </p>
              </div>
            </div>
          </div>

          {/* embeded code sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
                <Code2 size={18} />
                Embed Code
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                Paste this snippet into your HTML before the ending
                &lt;/body&gt; tag.
              </p>

             <EmbedCode code={embedScript} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
