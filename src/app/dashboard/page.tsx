import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8 mt-20">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-3xl border border-border bg-white/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-sm dark:bg-black/30">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-forground">
            Welcome, {session.user.name || session.user.email}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Your account is verified and you are now logged in.
          </p>
        </div>
      </div>
    </main>
  );
}
