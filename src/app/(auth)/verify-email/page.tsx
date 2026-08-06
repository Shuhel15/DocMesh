"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import { Loader } from "@/components/ui/loader";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email =
    searchParams.get("email") ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("verificationEmail") ?? ""
      : "");

  return (
    <main className="min-h-screen bg-background px-4 pt-24 sm:pt-28 pb-12 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-md items-center justify-center">
        <section className="w-full rounded-3xl border border-border bg-white/80 p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-sm dark:bg-black/30 sm:p-8">
          
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            <span className="relative inline-block">
              DocMesh
              <span className="absolute -bottom-2 left-0 h-0.75 w-full rounded-full bg-black/20 dark:bg-white/20" />
            </span>
          </Link>

          <div className="mt-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-border text-2xl">
              <Mail />
            </div>

            <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
              Check your email
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              We&apos;ve sent a verification link to
            </p>

            {email && (
              <p className="mt-2 break-all text-sm font-medium text-foreground">
                {email}
              </p>
            )}

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Please check your inbox and click the Verify Email button to
              verify your account.
            </p>

            <p className="mt-6 text-xs leading-5 text-muted-foreground">
              Didn&apos;t receive the email? Check your spam or junk folder.
            </p>

            <Link
              href="/login"
              className="mt-6 inline-block text-sm font-medium text-black underline-offset-4 hover:underline dark:text-white"
            >
              Back to Login
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader />
            
          </div>
        </main>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}