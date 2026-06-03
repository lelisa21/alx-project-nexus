"use client";

import { setUser } from "@/features/auth/authSlice";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth";
import { useAppDispatch } from "@/store/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Bot, CheckCircle2, Eye, EyeOff, Lock, Mail, Radio, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { register, handleSubmit, formState: { errors }, setError, setValue } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.error || "Login failed. Please check your credentials.");
      dispatch(setUser(responseData.user || responseData));
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError("root", { message: error instanceof Error ? error.message : "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setValue("email", "demo@example.com");
    setValue("password", "demo123");
  };

  return (
    <main className="product-shell grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden flex-col justify-between bg-slate-950 p-10 text-white lg:flex">
        <Link href="/" className="flex items-center gap-3 font-bold">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400 text-slate-950">
            <Radio className="h-5 w-5" />
          </span>
          Pollify
        </Link>
        <div>
          <p className="text-sm font-bold text-emerald-300">Recruiter demo ready</p>
          <h1 className="mt-4 max-w-xl text-5xl font-bold leading-tight">
            Step into a polished audience intelligence workspace.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-6 text-white/60">
            The demo account includes sample polls, analytics, AI recommendations, live room states,
            and enterprise workflow cues.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {["Live dashboards", "AI insights", "Team workspaces", "Export-ready analytics"].map((item) => (
            <div key={item} className="rounded-lg border border-white/10 bg-white/6 p-4 text-sm font-bold">
              <CheckCircle2 className="mb-3 h-4 w-4 text-emerald-300" />
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-950">
            <Radio className="h-4 w-4" />
            Pollify
          </Link>
          <div>
            <p className="text-sm font-bold uppercase text-emerald-700">Sign in</p>
            <h1 className="mt-2 text-3xl font-bold">Open your command center.</h1>
            <p className="mt-2 text-sm text-slate-500">Use the seeded demo account for the fastest walkthrough.</p>
          </div>

          <button onClick={fillDemo} className="mt-6 flex w-full items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-left">
            <span>
              <span className="flex items-center text-sm font-bold text-emerald-900">
                <Bot className="mr-2 h-4 w-4" />
                Use recruiter demo
              </span>
              <span className="mt-1 block text-xs text-emerald-800">demo@example.com / demo123</span>
            </span>
            <ArrowRight className="h-4 w-4 text-emerald-800" />
          </button>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            <label className="block">
              <span className="text-sm font-bold">Email</span>
              <span className="relative mt-2 block">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input {...register("email")} type="email" className="input-primary pl-10" placeholder="you@company.com" />
              </span>
              {errors.email && <span className="mt-1 block text-sm font-semibold text-red-600">{errors.email.message}</span>}
            </label>

            <label className="block">
              <span className="text-sm font-bold">Password</span>
              <span className="relative mt-2 block">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input {...register("password")} type={showPassword ? "text" : "password"} className="input-primary pl-10 pr-10" placeholder="Password" />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
              {errors.password && <span className="mt-1 block text-sm font-semibold text-red-600">{errors.password.message}</span>}
            </label>

            {errors.root && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{errors.root.message}</div>}

            <button type="submit" disabled={loading} className="btn-primary flex w-full items-center justify-center py-3">
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <Sparkles className="ml-2 h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New to Pollify? <Link href="/register" className="font-bold text-slate-950">Create an account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
