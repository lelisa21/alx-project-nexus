"use client";

import { Button } from "@/components/ui/Button";
import { addPoll } from "@/features/polls/pollsSlice";
import { enterpriseSignals, pollTemplates, questionSuggestions } from "@/lib/productDemo";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Eye,
  Palette,
  Plus,
  Radio,
  Save,
  Send,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

interface PollFormData {
  question: string;
  description: string;
  options: { text: string }[];
}

interface PollSettings {
  isPublic: boolean;
  allowMultipleVotes: boolean;
  requireEmail: boolean;
  showResults: boolean;
  endDate: string;
}

const steps = ["Design", "Options", "Experience", "Publish"];

export default function CreatePoll() {
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [accent, setAccent] = useState("emerald");
  const [draftSaved, setDraftSaved] = useState(false);
  const [pollSettings, setPollSettings] = useState<PollSettings>({
    isPublic: true,
    allowMultipleVotes: false,
    requireEmail: false,
    showResults: true,
    endDate: "",
  });

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { register, control, handleSubmit, watch, setValue } = useForm<PollFormData>({
    defaultValues: {
      question: "",
      description: "",
      options: [{ text: "" }, { text: "" }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({ control, name: "options" });
  const question = watch("question");
  const description = watch("description");
  const options = watch("options");
  const validOptions = options.filter((option) => option.text.trim());
  const isValidForm = question.trim() && validOptions.length >= 2;

  const progress = useMemo(() => {
    let score = 0;
    if (question.trim()) score += 30;
    if (description.trim()) score += 15;
    if (validOptions.length >= 2) score += 30;
    if (pollSettings.endDate) score += 10;
    if (draftSaved) score += 15;
    return Math.min(100, score);
  }, [description, draftSaved, pollSettings.endDate, question, validOptions.length]);

  const applyTemplate = (templateName: string) => {
    const templates: Record<string, string[]> = {
      "Executive Pulse": ["Very confident", "Somewhat confident", "Needs discussion", "Blocked"],
      "Town Hall Q&A": ["Product roadmap", "Customer feedback", "Team process", "Company strategy"],
      "Product Roadmap": ["Onboarding improvements", "Team workspaces", "Live Q&A", "Advanced analytics"],
      "Training Check": ["Understood fully", "Need examples", "Need follow-up", "Not clear yet"],
    };
    setValue("question", `${templateName}: what should we focus on next?`);
    setValue("description", "A structured audience intelligence session created from a Pollify template.");
    replace((templates[templateName] || templates["Product Roadmap"]).map((text) => ({ text })));
    setDraftSaved(true);
  };

  const applySuggestion = (suggestion: string) => {
    setValue("question", suggestion);
    setValue("description", "A guided prompt designed to surface a clear decision signal.");
    replace(["High priority", "Medium priority", "Low priority", "Needs more context"].map((text) => ({ text })));
  };

  const onSubmit = async (data: PollFormData) => {
    setLoading(true);
    try {
      const payload = {
        question: data.question.trim(),
        description: data.description || "",
        options: data.options.filter((opt) => opt.text.trim()).map((opt) => ({ text: opt.text.trim(), votes: 0 })),
        settings: pollSettings,
        createdBy: user?.id || null,
      };

      const response = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.details || responseData.error || "Failed to create poll");
      dispatch(addPoll(responseData));
      router.push(`/polls/${responseData.id}`);
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to create poll");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <Link href="/dashboard" className="mb-4 inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-950">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to command center
          </Link>
          <p className="text-sm font-bold uppercase text-emerald-700">Poll Builder</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Design a live audience experience.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Move from blank page to a polished poll with guided prompts, templates, live preview, and publishing controls.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={Save} onClick={() => setDraftSaved(true)}>
            {draftSaved ? "Draft saved" : "Save draft"}
          </Button>
          <Button icon={Send} disabled={!isValidForm || loading} loading={loading} onClick={handleSubmit(onSubmit)}>
            Publish
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-2 sm:grid-cols-4">
              {steps.map((step, index) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => setActiveStep(index)}
                  className={`rounded-lg px-3 py-3 text-left text-sm font-bold ${
                    activeStep === index ? "bg-slate-950 text-white" : "bg-[#f7f8f3] text-slate-600"
                  }`}
                >
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">{index + 1}</span>
                  {step}
                </button>
              ))}
            </div>
          </section>

          {activeStep === 0 && (
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <MessageIcon />
                <h2 className="text-xl font-bold">Start with intent</h2>
              </div>
              <div className="mt-6 grid gap-4">
                <label className="space-y-2">
                  <span className="text-sm font-bold">Question</span>
                  <input {...register("question", { required: true })} className="input-primary py-3 text-base" placeholder="What should we prioritize next quarter?" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold">Context</span>
                  <textarea {...register("description")} className="input-primary min-h-28 resize-none py-3 text-base" placeholder="Give participants enough context to answer well." />
                </label>
              </div>
              <div className="mt-6 grid gap-3 lg:grid-cols-3">
                {questionSuggestions.map((suggestion) => (
                  <button key={suggestion} type="button" onClick={() => applySuggestion(suggestion)} className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-left text-sm font-semibold text-emerald-900">
                    <CheckCircle2 className="mb-3 h-4 w-4" />
                    {suggestion}
                  </button>
                ))}
              </div>
            </section>
          )}

          {activeStep === 1 && (
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Radio className="h-5 w-5 text-emerald-700" />
                  <h2 className="text-xl font-bold">Answer choices</h2>
                </div>
                <span className="text-sm font-bold text-slate-500">{fields.length}/8 options</span>
              </div>
              <div className="mt-6 space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#f7f8f3] text-sm font-bold">{String.fromCharCode(65 + index)}</span>
                    <input {...register(`options.${index}.text`, { required: true })} className="input-primary" placeholder={`Option ${index + 1}`} />
                    {fields.length > 2 && (
                      <button type="button" onClick={() => remove(index)} className="rounded-lg border border-slate-200 p-3 text-slate-500 hover:text-red-600" aria-label="Remove option">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {fields.length < 8 && (
                <button type="button" onClick={() => append({ text: "" })} className="mt-4 flex w-full items-center justify-center rounded-lg border border-dashed border-slate-300 py-3 text-sm font-bold text-slate-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Add option
                </button>
              )}
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {pollTemplates.map((template) => (
                  <button key={template.name} type="button" onClick={() => applyTemplate(template.name)} className="rounded-lg border border-slate-200 p-4 text-left hover:bg-slate-50">
                    <template.icon className="h-4 w-4 text-emerald-700" />
                    <p className="mt-2 text-sm font-bold">{template.name}</p>
                    <p className="text-xs text-slate-500">{template.questions} prompts, {template.type}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {activeStep === 2 && (
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-emerald-700" />
                <h2 className="text-xl font-bold">Theme and participation</h2>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {["emerald", "amber", "slate", "rose"].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setAccent(color)}
                    className={`rounded-lg border p-4 text-left font-bold capitalize ${accent === color ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white"}`}
                  >
                    <span className={`mb-3 block h-7 w-7 rounded-full ${color === "emerald" ? "bg-emerald-500" : color === "amber" ? "bg-amber-400" : color === "rose" ? "bg-rose-500" : "bg-slate-700"}`} />
                    {color} theme
                  </button>
                ))}
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {[
                  ["Public poll", "Anyone with the link can participate", "isPublic"],
                  ["Multiple votes", "Useful for brainstorm ranking", "allowMultipleVotes"],
                  ["Require email", "Capture accountable responses", "requireEmail"],
                  ["Show results", "Let participants see live outcomes", "showResults"],
                ].map(([label, helper, key]) => (
                  <label key={key} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                    <span>
                      <span className="block text-sm font-bold">{label}</span>
                      <span className="text-xs text-slate-500">{helper}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={Boolean(pollSettings[key as keyof PollSettings])}
                      onChange={(event) => setPollSettings((prev) => ({ ...prev, [key]: event.target.checked }))}
                      className="h-5 w-5 accent-emerald-600"
                    />
                  </label>
                ))}
              </div>
            </section>
          )}

          {activeStep === 3 && (
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-emerald-700" />
                <h2 className="text-xl font-bold">Publish controls</h2>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="flex items-center text-sm font-bold">
                    <CalendarClock className="mr-2 h-4 w-4" />
                    Scheduled end
                  </span>
                  <input
                    type="datetime-local"
                    value={pollSettings.endDate}
                    onChange={(event) => setPollSettings((prev) => ({ ...prev, endDate: event.target.value }))}
                    className="input-primary"
                  />
                </label>
                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <Users className="h-4 w-4 text-emerald-700" />
                    Collaborators
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">Nadia, Alex, and Product Ops can edit this session in the demo workspace.</p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {enterpriseSignals.map((signal) => (
                  <div key={signal.label} className="rounded-lg bg-[#f7f8f3] p-3 text-sm font-bold">
                    <signal.icon className="mb-2 h-4 w-4 text-emerald-700" />
                    {signal.label}
                  </div>
                ))}
              </div>
            </section>
          )}
        </form>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center text-lg font-bold">
                <Eye className="mr-2 h-5 w-5 text-emerald-700" />
                Live preview
              </h2>
              <span className="text-xs font-bold text-emerald-700">{progress}% ready</span>
            </div>
            <div className="mt-4 h-2 rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-5 rounded-lg bg-slate-950 p-4 text-white">
              <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-bold capitalize">{accent} session</span>
              <h3 className="mt-4 text-xl font-bold">{question || "Your poll question appears here"}</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">{description || "Add context so participants know how to answer."}</p>
              <div className="mt-4 space-y-2">
                {(validOptions.length ? validOptions : [{ text: "Option A" }, { text: "Option B" }]).slice(0, 5).map((option, index) => (
                  <div key={`${option.text}-${index}`} className="rounded-lg bg-white/8 p-3 text-sm font-semibold">
                    {String.fromCharCode(65 + index)}. {option.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="flex items-center text-lg font-bold">
              <CheckCircle2 className="mr-2 h-5 w-5 text-emerald-700" />
              Builder checklist
            </h2>
            <div className="mt-4 space-y-3 text-sm font-semibold">
              {[
                ["Question", Boolean(question.trim())],
                ["Two options", validOptions.length >= 2],
                ["Theme selected", Boolean(accent)],
                ["Draft saved", draftSaved],
              ].map(([label, complete]) => (
                <div key={label as string} className="flex items-center justify-between">
                  <span>{label}</span>
                  <span className={complete ? "text-emerald-700" : "text-slate-300"}>{complete ? "Ready" : "Needed"}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveStep(Math.min(activeStep + 1, steps.length - 1))}
            className="flex w-full items-center justify-center rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white disabled:opacity-40"
            disabled={activeStep === steps.length - 1}
          >
            Continue
            <ChevronRight className="ml-2 h-4 w-4" />
          </button>
        </aside>
      </div>
    </div>
  );
}
