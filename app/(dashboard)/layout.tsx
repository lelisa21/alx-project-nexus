"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { logout } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  BarChart3,
  Bell,
  Bot,
  Building2,
  Home,
  LayoutTemplate,
  LogOut,
  Menu,
  MessageSquareText,
  Plus,
  Radio,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout");
    dispatch(logout());
    router.push("/");
  };

  const navigation = [
    { name: "Command Center", href: "/dashboard", icon: Home },
    { name: "Poll Builder", href: "/polls/create", icon: Plus },
    { name: "Poll Library", href: "/polls", icon: BarChart3 },
    { name: "Live Q&A", href: "/polls?mode=qa", icon: MessageSquareText },
    { name: "Templates", href: "/polls/create?template=true", icon: LayoutTemplate },
    { name: "Workspace", href: "/profile", icon: Building2 },
  ];

  const sidebar = (
    <div className="flex h-full flex-col bg-slate-950 text-white">
      <div className="flex h-20 items-center justify-between px-5">
        <Link href="/dashboard" className="flex items-center gap-3 font-bold">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400 text-slate-950">
            <Radio className="h-5 w-5" />
          </span>
          <span className="text-lg">Pollify</span>
        </Link>
        <button className="md:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="px-4">
        <Link
          href="/polls/create"
          className="mb-5 flex items-center justify-center rounded-lg bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Create with AI
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navigation.map((item) => {
          const current = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href.split("?")[0]));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center rounded-lg px-3 py-3 text-sm font-semibold transition ${
                current ? "bg-white text-slate-950" : "text-white/72 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="m-4 rounded-lg border border-white/10 bg-white/6 p-4">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-200">
          <Bot className="h-4 w-4" />
          AI engagement coach
        </div>
        <p className="mt-2 text-xs leading-5 text-white/60">
          Recommend a follow-up poll when confidence drops below 60%.
        </p>
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-sm font-bold text-slate-950">
            {user?.name?.charAt(0).toUpperCase() || "D"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{user?.name || "Demo User"}</p>
            <p className="truncate text-xs text-white/50">{user?.email || "demo@example.com"}</p>
          </div>
          <button onClick={handleLogout} className="rounded-md p-2 text-white/60 hover:bg-white/10 hover:text-white" aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f7f8f3]">
        {sidebarOpen && <div className="fixed inset-0 z-40 bg-slate-950/50 md:hidden" onClick={() => setSidebarOpen(false)} />}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform transition md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          {sidebar}
        </aside>

        <div className="md:pl-72">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-[#f7f8f3]/88 backdrop-blur-xl">
            <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
              <button className="rounded-lg border border-slate-200 bg-white p-2 md:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </button>
              <div className="hidden min-w-0 flex-1 items-center rounded-lg border border-slate-200 bg-white px-3 py-2 md:flex">
                <Search className="mr-2 h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-500">Search polls, templates, comments, and insights...</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 sm:flex">
                  <span className="live-dot" />
                  Live sync
                </span>
                <button className="rounded-lg border border-slate-200 bg-white p-2" aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                </button>
                <button className="rounded-lg border border-slate-200 bg-white p-2" aria-label="Security">
                  <ShieldCheck className="h-4 w-4" />
                </button>
                <button className="rounded-lg border border-slate-200 bg-white p-2" aria-label="Settings">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>
          <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
