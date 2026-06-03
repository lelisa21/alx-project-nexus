import {
  Activity,
  BarChart3,
  Bot,
  Brain,
  Building2,
  CalendarClock,
  Globe2,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

export const demoMetrics = [
  { label: "Live participants", value: "1,284", delta: "+18.6%" },
  { label: "Avg. engagement", value: "74%", delta: "+9.2%" },
  { label: "Response speed", value: "1.4s", delta: "realtime" },
  { label: "Insights created", value: "326", delta: "+41" },
];

export const engagementTimeline = [
  { time: "09:00", votes: 18, comments: 3 },
  { time: "09:10", votes: 46, comments: 9 },
  { time: "09:20", votes: 91, comments: 17 },
  { time: "09:30", votes: 138, comments: 28 },
  { time: "09:40", votes: 211, comments: 42 },
  { time: "09:50", votes: 286, comments: 58 },
];

export const audienceSegments = [
  { label: "North America", value: 42 },
  { label: "Europe", value: 31 },
  { label: "Africa", value: 16 },
  { label: "Asia Pacific", value: 11 },
];

export const deviceSegments = [
  { label: "Mobile", value: 58 },
  { label: "Desktop", value: 34 },
  { label: "Tablet", value: 8 },
];

export const featurePillars = [
  {
    icon: Zap,
    title: "Live audience rooms",
    text: "Presence, instant vote updates, reactions, Q&A, and reconnection-aware sessions for events and teams.",
  },
  {
    icon: Brain,
    title: "AI-assisted creation",
    text: "Generate questions, answer choices, audience prompts, and follow-up recommendations from a goal.",
  },
  {
    icon: BarChart3,
    title: "Decision analytics",
    text: "Track participation, sentiment, cohorts, timelines, devices, regions, and historical performance.",
  },
  {
    icon: Building2,
    title: "Workspace controls",
    text: "Team spaces, shared templates, roles, audit trails, brand kits, and organization-ready settings.",
  },
];

export const useCases = [
  "All-hands pulse checks",
  "Conference Q&A",
  "Product roadmap voting",
  "Training comprehension",
  "Customer research",
  "Classroom engagement",
];

export const aiSuggestions = [
  "What should we prioritize next to reduce onboarding friction?",
  "Which release risk needs leadership attention this week?",
  "How confident are you in the current launch plan?",
];

export const pollTemplates = [
  { name: "Executive Pulse", type: "Likert", questions: 5, icon: Activity },
  { name: "Town Hall Q&A", type: "Live event", questions: 8, icon: MessageSquareText },
  { name: "Product Roadmap", type: "Ranked vote", questions: 4, icon: Sparkles },
  { name: "Training Check", type: "Quiz", questions: 10, icon: ShieldCheck },
];

export const recentActivity = [
  "Marketing workspace launched Brand Recall Study",
  "AI summarized 286 responses for Product Roadmap",
  "Nadia invited 3 collaborators to Customer Advisory Board",
  "Town Hall Q&A crossed 1,200 live participants",
];

export const pricingPlans = [
  { name: "Starter", price: "$0", detail: "For quick polls and demos", cta: "Start free" },
  { name: "Pro", price: "$19", detail: "For teams running recurring sessions", cta: "Try Pro" },
  { name: "Business", price: "$79", detail: "For branded audience intelligence", cta: "Contact sales" },
];

export const enterpriseSignals = [
  { icon: ShieldCheck, label: "Audit logs" },
  { icon: Globe2, label: "Custom domains" },
  { icon: Users, label: "Role management" },
  { icon: CalendarClock, label: "Scheduled publishing" },
  { icon: Bot, label: "AI insights" },
];
