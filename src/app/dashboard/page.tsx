import { redirect } from "next/navigation";
import Link from "next/link";
import { Bot, Plus, ArrowRight} from "lucide-react";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface ChatbotCard {
  id: string;
  name: string;
  createdAt: Date;
}

export default async function DashboardPage() {
  //check if user is authenticated or not
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // get or create user's company
  let company = await prisma.company.findFirst({
    where: {
      userId,
    },
  });

  if (!company) {
    company = await prisma.company.create({
      data: {
        name: session.user.name ? `${session.user.name}'s Company` : "My Company",
        userId,
      },
    });
  }

  // fetch chatbot count and recent chatbots
  const [chatbotCount, chatbots]: [number, ChatbotCard[]] = await Promise.all([
    prisma.chatbot.count({
      where: {
        companyId: company.id,
      },
    }),
    prisma.chatbot.findMany({
      where: {
        companyId: company.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    }),
  ]) as [number, ChatbotCard[]];

  const userName = session.user.name?.split(" ")[0] || "there";

  return (
    <main className="min-h-screen bg-background text-foreground pt-24 sm:pt-28 pb-10 sm:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Dashboard</p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Welcome back, {userName}
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Manage your AI chatbots and knowledge bases from here.
            </p>
          </div>

          <Link
            href="/dashboard/chatbots/new"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition hover:opacity-90
            hover:scale-105 ease-in-out duration-200"
          >
            <Plus size={17} />
            Create Chatbot
          </Link>
        </div>

        <section className="mt-8">
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-muted text-foreground">
                  <Bot size={28} />
                </div>
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Chatbots Overview
                  </span>
                  <p className="mt-1 text-4xl font-bold tracking-tight">
                    {chatbotCount}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Total chatbots in your workspace
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/chatbots"
                className="group inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted
                 duration-200"
              >
                View All Chatbots
                <ArrowRight size={16} className="group-hover:transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Your Chatbots</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Quick access to your active AI assistants.
              </p>
            </div>

            {chatbots.length > 0 && (
              <Link
                href="/dashboard/chatbots"
                className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
              >
                See all ({chatbotCount})
              </Link>
            )}
          </div>

          {chatbots.length === 0 ? (
            <div className="mt-6 flex min-h-36 items-center justify-center rounded-lg border border-dashed border-border p-8">
              <div className="text-center">
                <Bot size={28} className="mx-auto text-muted-foreground" />
                <p className="mt-3 text-sm font-medium text-foreground">
                  No chatbots created yet ?
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Create your first chatbot to start training it with your data.
                </p>
                <Link
                  href="/dashboard/chatbots/new"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-background transition hover:opacity-90
                  hover:scale-105 ease-in-out duration-200"
                >
                  <Plus size={15} />
                  Create Chatbot
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {chatbots.map((chatbot: ChatbotCard) => (
                <div
                  key={chatbot.id}
                  className="group rounded-xl border border-border bg-background p-5 transition-all hover:border-foreground/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
                      <Bot size={20} />
                    </div>
                    <span className="rounded-full border border-border text-white bg-green-500 dark:bg-green-600 px-2.5 py-0.5 text-xs font-medium">
                      Active
                    </span>
                  </div>

                  <h3 className="mt-4 truncate text-base font-semibold">
                    {chatbot.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Created {new Date(chatbot.createdAt).toLocaleDateString()}
                  </p>

                  <Link
                    href={`/dashboard/chatbots/${chatbot.id}`}
                    className="mt-4 flex items-center justify-between rounded-lg border border-border px-3 py-2 text-xs font-medium transition hover:bg-muted"
                  >
                    Open Chatbot
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
