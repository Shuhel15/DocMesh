"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  const router = useRouter();
  const serchParams = useSearchParams();
  const email = serchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    try {
      setLoading(true);

      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Email verification failed. Please try again.");
        return;
      }

      toast.success("Email verified successfully. You can now log in.");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.error("VERIFY EMAIL ERROR:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      setError("Email is missing. Please go back and try again.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      setResendLoading(true);

      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to resend OTP. Please try again.");
        return;
      }

      toast.success("OTP resent successfully. Check your email.");
      setResendCooldown(60);
    } catch (error) {
      console.error("RESEND OTP ERROR:", error);
      toast.error("Something went wrong while resending OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="border border-border bg-card p-6 sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold">Verify Email</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              We sent a 6-digit OTP to your email.
            </p>

            {email && (
              <p className="mt-2 text-sm font-medium break-all">{email}</p>
            )}
          </div>

          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label htmlFor="otp" className="mb-2 block text-sm font-medium">
                Enter OTP
              </label>

              <input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);

                  setOtp(value);
                }}
                placeholder="Enter 6-digit OTP"
                className="h-11 w-full border border-border bg-background px-3 text-center text-lg tracking-[0.4em] outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {success && <p className="text-sm text-green-500">{success}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the OTP?
            </p>

            <Button
              type="button"
              variant="link"
              className="mt-1 px-0"
              onClick={handleResendOTP}
              disabled={resendLoading || resendCooldown > 0}
            >
              {resendLoading
                ? "Sending..."
                : resendCooldown > 0
                  ? `Resend OTP in ${resendCooldown}s`
                  : "Resend OTP"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
