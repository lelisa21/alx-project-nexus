"use client";

import { registerSchema, RegisterInput } from "@/lib/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Lock, LucideIcon, Mail, Radio, User, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, setError } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.error || "Registration failed. Please try again.");
      router.push("/login");
      router.refresh();
    } catch (error) {
      setError("root", { message: error instanceof Error ? error.message : "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="product-shell grid min-h-screen place-items-center p-4 sm:p-8">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[0.95fr_1.05fr]">
        <section className="bg-slate-950 p-8 text-white sm:p-10">
          <Link href="/" className="flex items-center gap-3 font-bold">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400 text-slate-950">
              <Radio className="h-5 w-5" />
            </span>
            Pollify
          </Link>
          <h1 className="mt-12 text-4xl font-bold leading-tight">Create a workspace for decisions, not just polls.</h1>
          <p className="mt-4 text-sm leading-6 text-white/60">
            Launch branded sessions, invite collaborators, collect reactions, and turn responses into a reusable intelligence library.
          </p>
          <div className="mt-10 grid gap-3">
            {[
              { title: "Live rooms", text: "Instant participant and vote updates", icon: Zap },
              { title: "Team workflows", text: "Shared templates, roles, and activity", icon: Users },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-white/10 bg-white/6 p-4">
                <item.icon className="h-5 w-5 text-emerald-300" />
                <p className="mt-3 font-bold">{item.title}</p>
                <p className="mt-1 text-sm text-white/55">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="p-6 sm:p-10">
          <p className="text-sm font-bold uppercase text-emerald-700">Create account</p>
          <h2 className="mt-2 text-3xl font-bold">Start building with Pollify.</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <Field icon={User} label="Full name" error={errors.name?.message}>
              <input {...register("name")} type="text" className="input-primary pl-10" placeholder="Ada Lovelace" />
            </Field>
            <Field icon={Mail} label="Email" error={errors.email?.message}>
              <input {...register("email")} type="email" className="input-primary pl-10" placeholder="you@company.com" />
            </Field>
            <Field icon={Lock} label="Password" error={errors.password?.message}>
              <input {...register("password")} type={showPassword ? "text" : "password"} className="input-primary pl-10 pr-10" placeholder="Create a strong password" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Toggle password visibility">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </Field>
            <Field icon={Lock} label="Confirm password" error={errors.confirmPassword?.message}>
              <input {...register("confirmPassword")} type={showPassword ? "text" : "password"} className="input-primary pl-10" placeholder="Confirm password" />
            </Field>

            {errors.root && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{errors.root.message}</div>}

            <button type="submit" disabled={isSubmitting} className="btn-primary flex w-full items-center justify-center py-3">
              {isSubmitting ? "Creating workspace..." : "Create workspace"}
              {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account? <Link href="/login" className="font-bold text-slate-950">Sign in</Link>
          </p>
        </section>
      </div>
    </main>
  );
}

function Field({
  icon: Icon,
  label,
  error,
  children,
}: {
  icon: LucideIcon;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold">{label}</span>
      <span className="relative mt-2 block">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        {children}
      </span>
      {error && <span className="mt-1 block text-sm font-semibold text-red-600">{error}</span>}
    </label>
  );
}
