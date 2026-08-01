
"use client"

import { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

function GoogleIcon() {
	return (
		<svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
			<path
				fill="#4285F4"
				d="M21.35 11.1h-9.18v2.98h5.29c-.23 1.37-.97 2.53-2.08 3.31v2.75h3.37c1.98-1.82 3.12-4.5 3.12-7.67 0-.72-.06-1.42-.15-2.07Z"
			/>
			<path
				fill="#34A853"
				d="M12.17 22c2.67 0 4.91-.88 6.55-2.39l-3.37-2.75c-.93.63-2.12 1-3.18 1-2.45 0-4.53-1.66-5.27-3.88H3.4v2.84A9.99 9.99 0 0 0 12.17 22Z"
			/>
			<path
				fill="#FBBC05"
				d="M6.9 14.98a5.98 5.98 0 0 1 0-3.96V8.18H3.4a10 10 0 0 0 0 8.9l3.5-2.1Z"
			/>
			<path
				fill="#EA4335"
				d="M12.17 5.44c1.45 0 2.76.5 3.79 1.47l2.84-2.84A9.57 9.57 0 0 0 12.17 2a9.99 9.99 0 0 0-8.77 5.18l3.5 2.7c.74-2.22 2.82-4.44 5.27-4.44Z"
			/>
		</svg>
	)
}

export default function LoginPage() {
	const router = useRouter()

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [googleLoading, setGoogleLoading] = useState(false)
	const [error, setError] = useState("")

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		setError("")
		setLoading(true)

		try {
			const result = await signIn("credentials", {
				email,
				password,
				redirect: false,
			})

			if (result?.error) {
				if (
					result.error.includes("verify") ||
					result.error.includes("Verify")
				) {
					setError("Please verify your email before logging in.")
				} else {
					setError("Invalid email or password.")
				}

				return
			}

			if (result?.ok) {
				router.push("/dashboard")
				router.refresh()
			}
		} catch (error) {
			console.error("LOGIN_ERROR:", error)
			setError("Something went wrong. Please try again.")
		} finally {
			setLoading(false)
		}
	}

	const handleGoogleLogin = async () => {
		setError("")
		setGoogleLoading(true)

		try {
			await signIn("google", {
				callbackUrl: "/dashboard",
			})
		} catch (error) {
			console.error("GOOGLE_LOGIN_ERROR:", error)
			setError("Google login failed. Please try again.")
			setGoogleLoading(false)
		}
	}

	return (
		<main className="min-h-screen bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
			<div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-md items-center justify-center">
				<section className="w-full rounded-3xl border border-border bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-sm dark:bg-black/30 sm:p-8">
					<div className="flex flex-col items-center text-center">
						<Link
							href="/"
							className="text-2xl font-bold tracking-tight text-black dark:text-white"
						>
							<span className="relative inline-block">
								KNOWLY
								<span className="absolute -bottom-2 left-0 h-0.75 w-full rounded-full bg-black/20 dark:bg-white/20" />
							</span>
						</Link>

						<h1 className="mt-6 text-3xl font-semibold tracking-tight text-black dark:text-white">
							Welcome back
						</h1>

						<p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
							Log in to continue managing your knowledge and AI assistants.
						</p>
					</div>

					<form onSubmit={handleSubmit} className="mt-8 space-y-4">
						<div className="space-y-2">
							<label
								htmlFor="email"
								className="text-sm font-medium text-black/80 dark:text-white/80"
							>
								Email
							</label>

							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="flex h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-black placeholder:text-muted-foreground/80 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10 dark:bg-black/20 dark:text-white dark:placeholder:text-white/40 dark:focus:border-white dark:focus:ring-white/10"
							/>
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label
									htmlFor="password"
									className="text-sm font-medium text-black/80 dark:text-white/80"
								>
									Password
								</label>

							</div>

							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="flex h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-black placeholder:text-muted-foreground/80 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10 dark:bg-black/20 dark:text-white dark:placeholder:text-white/40 dark:focus:border-white dark:focus:ring-white/10"
							/>
						</div>

						{error && (
							<p className="text-sm text-red-600 dark:text-red-400">
								{error}
							</p>
						)}

						<Button
							type="submit"
							disabled={loading || googleLoading}
							className="h-11 w-full rounded-xl bg-black text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90"
						>
							{loading ? "Logging in..." : "Log In"}
						</Button>

						<div className="flex items-center gap-3 py-1">
							<div className="h-px flex-1 bg-border" />

							<span className="text-xs font-medium tracking-[0.2em] text-muted-foreground">
								OR
							</span>

							<div className="h-px flex-1 bg-border" />
						</div>

						<Button
							type="button"
							variant="outline"
							disabled={loading || googleLoading}
							onClick={handleGoogleLogin}
							className="h-11 w-full rounded-xl border-border bg-white text-black hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60 dark:bg-black/20 dark:text-white dark:hover:bg-white/10"
						>
							<span className="mr-2 inline-flex items-center justify-center rounded-full bg-white p-0.5 shadow-sm">
								<GoogleIcon />
							</span>

							{googleLoading ? "Connecting..." : "Continue with Google"}
						</Button>
					</form>

					<p className="mt-6 text-center text-sm text-muted-foreground">
						Don&lsquo;t have an account?{" "}
						<Link
							href="/register"
							className="font-medium text-black underline-offset-4 hover:underline dark:text-white"
						>
							Create account
						</Link>
					</p>
				</section>
			</div>
		</main>
	)
}

