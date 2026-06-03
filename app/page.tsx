"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  PlayCircle,
  Radio,
  Sparkles,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import {
  audienceSegments,
  demoMetrics,
  engagementTimeline,
  featurePillars,
  pricingPlans,
  useCases,
} from "@/lib/productDemo";

export default function Home() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const primaryHref = isAuthenticated ? "/dashboard" : "/register";
  const demoHref = isAuthenticated ? "/dashboard" : "/login";
  const maxVotes = Math.max(...engagementTimeline.map((item) => item.votes));

  return (
    <main className="product-shell min-h-screen text-slate-950">
      <nav className="sticky top-0 z-40 border-b border-slate-200/70 bg-[#fbfbf7]/86 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white">
              <Radio className="h-5 w-5" />
            </span>
            <span className="text-lg">Pollify</span>
          </Link>
          <div className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
            <a href="#product">Product</a>
            <a href="#analytics">Analytics</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm font-semibold text-slate-700 sm:block">
              Sign in
            </Link>
            <Link href={primaryHref} className="btn-primary">
              {isAuthenticated ? "Open app" : "Start free"}
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pb-20 lg:pt-16">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
            <span className="live-dot" />
            Real-time audience intelligence for modern teams
          </div>
          <h1 className="max-w-4xl text-5xl font-bold leading-[0.98] text-slate-950 sm:text-6xl lg:text-7xl">
            Pollify turns live feedback into decisions people trust.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Create beautiful polls, Q&A rooms, and pulse checks with AI-assisted prompts,
            live participation, branded sessions, and analytics that explain what your audience means.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={primaryHref} className="btn-primary inline-flex items-center justify-center px-6 py-3 text-base">
              Build a live session
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href={demoHref} className="btn-secondary inline-flex items-center justify-center px-6 py-3 text-base">
              <PlayCircle className="mr-2 h-4 w-4" />
              Recruiter demo
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {demoMetrics.map((metric) => (
              <div key={metric.label} className="metric-card">
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">{metric.label}</p>
                <p className="mt-2 text-xs font-bold text-emerald-700">{metric.delta}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-lg p-4">
          <div className="rounded-lg border border-slate-200 bg-slate-950 p-4 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase text-emerald-300">Live event</p>
                <h2 className="mt-1 text-xl font-bold">Product Roadmap Vote</h2>
              </div>
              <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-semibold text-emerald-200">
                284 online
              </div>
            </div>
            <div className="grid gap-4 py-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-3">
                {[
                  ["AI-generated onboarding", 72],
                  ["Team workspaces", 58],
                  ["Live Q&A", 46],
                  ["Advanced exports", 29],
                ].map(([label, value]) => (
                  <div key={label as string} className="rounded-lg bg-white/7 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">{label}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-emerald-300" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-white p-4 text-slate-950">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <p className="text-sm font-bold">AI insight</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Users favor onboarding automation, but comments cluster around team
                  adoption. Recommend a follow-up poll for admins and facilitators.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold">
                  <span className="rounded-md bg-emerald-50 px-2 py-2 text-emerald-800">+31% intent</span>
                  <span className="rounded-md bg-amber-50 px-2 py-2 text-amber-800">High urgency</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-6 items-end gap-2 border-t border-white/10 pt-4">
              {engagementTimeline.map((item) => (
                <div key={item.time} className="flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-emerald-300"
                    style={{ height: `${Math.max(28, (item.votes / maxVotes) * 120)}px` }}
                  />
                  <span className="text-[10px] text-white/60">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="product" className="border-y border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="section-kicker">Platform</p>
          <div className="mt-3 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <h2 className="text-4xl font-bold leading-tight">Built for engagement before, during, and after the room is live.</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {featurePillars.map((feature) => (
                <div key={feature.title} className="rounded-lg border border-slate-200 bg-[#fbfbf7] p-5">
                  <feature.icon className="h-6 w-6 text-emerald-700" />
                  <h3 className="mt-4 font-bold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="analytics" className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="section-kicker">Analytics preview</p>
          <h2 className="mt-3 text-4xl font-bold">Understand who answered, where momentum changed, and what to do next.</h2>
          <p className="mt-4 text-slate-600">
            Pollify combines response distribution, timeline movement, device analytics,
            geographic segments, participation rates, and AI summaries in one workspace.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {useCases.map((useCase) => (
              <span key={useCase} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold">
                {useCase}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500">Audience geography</p>
              <h3 className="text-2xl font-bold">812 responses</h3>
            </div>
            <BarChart3 className="h-6 w-6 text-emerald-700" />
          </div>
          <div className="mt-6 space-y-4">
            {audienceSegments.map((segment) => (
              <div key={segment.label}>
                <div className="flex justify-between text-sm font-semibold">
                  <span>{segment.label}</span>
                  <span>{segment.value}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-slate-950" style={{ width: `${segment.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {["Slido-speed live sessions", "Typeform-grade creation", "SurveyMonkey-grade analytics"].map((quote) => (
            <div key={quote} className="rounded-lg border border-white/10 bg-white/6 p-6">
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              <p className="mt-4 text-xl font-bold">{quote}</p>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Designed to make recruiters see product thinking, visual maturity,
                real workflow depth, and practical full-stack judgment within one minute.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="section-kicker">Pricing</p>
            <h2 className="mt-3 text-4xl font-bold">Start free, grow into a branded engagement stack.</h2>
          </div>
          <Link href={primaryHref} className="btn-primary inline-flex items-center justify-center px-5 py-3">
            Launch workspace <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div key={plan.name} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="mt-4 text-4xl font-bold">{plan.price}<span className="text-sm font-medium text-slate-500"> /mo</span></p>
              <p className="mt-3 text-sm text-slate-600">{plan.detail}</p>
              <button className="btn-secondary mt-6 w-full">{plan.cta}</button>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
          <div>
            <p className="section-kicker">FAQ</p>
            <h2 className="mt-3 text-4xl font-bold">Built to feel real, not like a CRUD demo.</h2>
          </div>
          <div className="grid gap-3">
            {[
              ["Can I run live events?", "Yes. Pollify includes live rooms, participant counts, instant results, reactions, and Q&A-ready workflows."],
              ["Does it support teams?", "The redesigned product experience includes workspaces, collaborators, roles, audit signals, shared templates, and brand controls."],
              ["What makes the demo recruiter-friendly?", "Demo entry points, sample analytics, polished empty states, and guided product cues show the platform value quickly."],
            ].map(([question, answer]) => (
              <details key={question} className="rounded-lg border border-slate-200 p-5">
                <summary className="cursor-pointer font-bold">{question}</summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-slate-600 sm:flex-row">
          <div className="flex items-center gap-2 font-bold text-slate-950">
            <Radio className="h-4 w-4" />
            Pollify
          </div>
          <div className="flex flex-wrap gap-4">
            <span>Audience intelligence</span>
            <span>Live Q&A</span>
            <span>AI insights</span>
            <span>Workspaces</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
