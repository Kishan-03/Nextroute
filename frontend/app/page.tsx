"use client";

import { useEffect, useRef, useState } from "react";
import CareerDiscovery from "./CareerDiscovery";
import { Bell, BookOpen, BriefcaseBusiness, Building2, ChevronDown, CircleUserRound, Code2, LayoutDashboard, Map, Menu, Moon, Search, Settings, Sparkles, Target, Trophy, Users, X } from "lucide-react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Getting Your Roadmap", icon: Map },
  { label: "My learning", icon: BookOpen },
  { label: "Opportunities", icon: BriefcaseBusiness },
  { label: "Companies", icon: Building2 },
  { label: "Company", icon: Building2 },
  { label: "Skill intelligence", icon: Sparkles },
  { label: "Industry intelligence", icon: Target },
  { label: "Student success", icon: Trophy },
  { label: "Skill bridge", icon: BriefcaseBusiness },
  { label: "Code lab", icon: Code2 },
  { label: "Community", icon: Users },
];
const metrics = [
  ["Skill readiness", "78%", "+12.4%", Target, "text-violet-300"],
  ["Learning progress", "64%", "+8.7%", BookOpen, "text-cyan-300"],
  ["Company matches", "24", "+6 this week", BriefcaseBusiness, "text-amber-300"],
  ["Profile strength", "92%", "Excellent", CircleUserRound, "text-emerald-300"],
] as const;

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [notice, setNotice] = useState(0);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
  useEffect(() => {
    void fetch(`${api}/auth/me`, { credentials: "include" }).then(async (response) => {
      if (!response.ok) { window.location.assign("/login"); return; }
      const data = await response.json() as { user: { name: string; email: string; role: string } };
      setUser(data.user);
    }).catch(() => window.location.assign("/login"));
  }, [api]);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false); };
    document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close);
  }, []);
  async function logout() { await fetch(`${api}/auth/logout`, { method: "POST", credentials: "include" }); window.location.assign("/login"); }
  const initials = (user?.name ?? "User").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const showMessage = (text: string) => { setMessage(text); window.setTimeout(() => setMessage(""), 2600); };

  return <main className={`dashboard-shell ${dark ? "bg-[#07111f] text-white" : "bg-slate-100 text-slate-950"} min-h-screen transition-colors`}>
    {message && <div className="fixed right-5 top-5 z-50 rounded-xl bg-violet-500 px-4 py-3 text-sm font-medium shadow-xl">{message}</div>}
    <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed z-20 flex h-screen w-72 flex-col overflow-y-auto bg-[#0d1020] p-6 text-white transition-transform lg:translate-x-0`}>
      <div className="mb-12 flex items-center justify-between"><div className="flex items-center gap-3"><div className="rounded-xl bg-violet-500 p-2"><Sparkles size={20}/></div><span className="text-xl font-bold">Nextroute</span></div><button onClick={() => setSidebarOpen(false)} className="lg:hidden" aria-label="Close menu"><X/></button></div>
      <nav className="min-h-0 flex-1 space-y-2">{navItems.map((item) => <button key={item.label} onClick={() => { const routes: Record<string, string> = { "Getting Your Roadmap": "/roadmap", "My learning": "/learning", Opportunities: "/opportunities", Companies: "/companies", Company: "/company", "Skill intelligence": "/ai", "Industry intelligence": "/industry", "Student success": "/success", "Skill bridge": "/bridge", "Code lab": "/editor", Community: "/community" }; const route = routes[item.label]; if (route) window.location.href = route; else showMessage("You are already on Overview"); }} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm ${item.label === "Overview" ? "bg-violet-500/15 text-violet-200" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><item.icon size={18}/>{item.label}</button>)}</nav>
      <div className="mt-6 shrink-0 space-y-2 border-t border-white/10 pt-4"><button onClick={() => showMessage("Settings are saved for Module 3")} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400"><Settings size={18}/> Settings</button><button onClick={() => setProfileOpen((open) => !open)} className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-left"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 font-bold text-slate-950">{initials}</div><div><p className="text-sm">{user?.name ?? "Loading..."}</p><p className="text-xs text-slate-500">{user?.role ?? ""}</p></div><ChevronDown size={16} className="ml-auto text-slate-500"/></button></div>
    </aside>
    <section className="lg:ml-72"><header className={`flex h-20 items-center justify-between border-b px-5 sm:px-10 ${dark ? "border-white/10" : "border-slate-200"}`}><button onClick={() => setSidebarOpen(true)} className="lg:hidden" aria-label="Open menu"><Menu/></button><div className="relative hidden w-96 md:block"><Search className="absolute left-3 top-3 text-slate-500" size={18}/><input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && showMessage(query ? `Searching for ${query}` : "Type a search term first")} className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 text-sm outline-none focus:border-violet-400" placeholder="Search skills, courses, opportunities..."/></div><div className="ml-auto flex items-center gap-3"><button onClick={() => setDark(!dark)} className="rounded-full p-2 text-slate-400 hover:bg-white/10" aria-label="Toggle dark mode"><Moon size={19}/></button><button onClick={() => { setNotice(0); showMessage(notice ? "Notifications marked as read" : "You are all caught up"); }} className="relative rounded-full p-2 text-slate-400 hover:bg-white/10" aria-label="Notifications"><Bell size={19}/>{notice > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-violet-400"/>}</button><div className="relative" ref={profileRef}><button onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen} aria-label="Open profile menu" className="flex items-center gap-2 border-l border-white/10 pl-4 text-left"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 font-bold text-slate-950">{initials}</div><div className="hidden sm:block"><p className="text-sm">{user?.name ?? "Loading..."}</p><p className="text-xs text-slate-500">{user?.email ?? ""}</p></div><ChevronDown size={16} className="text-slate-500"/></button>{profileOpen && <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-white/10 bg-[#161a2d] p-2 shadow-2xl"><div className="border-b border-white/10 px-3 py-2"><p className="text-sm font-medium">{user?.name}</p><p className="truncate text-xs text-slate-500">{user?.email}</p></div><button onClick={() => { setProfileOpen(false); window.location.assign("/profile"); }} className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10">My Profile</button><button onClick={() => void logout()} className="w-full rounded-xl px-3 py-2 text-left text-sm text-rose-300 hover:bg-rose-400/10">Sign out</button></div>}</div></div></header>
      <div className="p-5 sm:p-10"><div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-sm text-violet-300">Monday, 14 September 2026</p><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Good morning, Aarav 👋</h1><p className="mt-2 text-slate-400">Your path to industry readiness is looking strong.</p></div><button onClick={() => { window.location.href = "/ai"; }} className="flex w-fit items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold shadow-lg shadow-violet-500/20"><Sparkles size={16}/> Improve my skills</button></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([label, value, delta, Icon, color]) => <button key={label} onClick={() => showMessage(`${label}: ${value}`)} className="rounded-2xl border border-white/10 bg-white/[.04] p-5 text-left transition hover:-translate-y-0.5 hover:border-violet-400/50"><div className="mb-5 flex items-center justify-between"><span className={`rounded-xl bg-white/5 p-2.5 ${color}`}><Icon size={20}/></span><span className="text-xs text-emerald-300">{delta}</span></div><p className="text-sm text-slate-400">{label}</p><p className="mt-1 text-3xl font-semibold">{value}</p></button>)}</div>
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]"><div className="rounded-2xl border border-white/10 bg-white/[.04] p-6"><div className="mb-6 flex items-center justify-between"><div><h2 className="font-semibold">Readiness trajectory</h2><p className="mt-1 text-sm text-slate-500">Your progress vs. industry benchmark</p></div><select onChange={(event) => showMessage(`Showing ${event.target.value}`)} className="rounded-lg border border-white/10 bg-white/5 p-2 text-xs text-slate-300"><option>Last 6 months</option><option>Last year</option></select></div><div className="flex h-56 items-end gap-3 sm:gap-6">{[35,42,48,55,64,78].map((height, index) => <div className="flex flex-1 flex-col items-center gap-3" key={index}><div className="w-full rounded-t-lg bg-gradient-to-t from-violet-600 to-cyan-300" style={{ height: `${height * 2}px` }}/><span className="text-xs text-slate-500">{["Apr","May","Jun","Jul","Aug","Sep"][index]}</span></div>)}</div></div><div className="rounded-2xl border border-white/10 bg-white/[.04] p-6"><div className="mb-6 flex items-center justify-between"><div><h2 className="font-semibold">Recommended for you</h2><p className="mt-1 text-sm text-slate-500">Based on your target roles</p></div><Sparkles size={18} className="text-violet-300"/></div><div className="space-y-4">{[["System Design","High demand · 4 weeks"],["AWS Architecture","Trending · 6 weeks"],["Communication","Gap detected · 2 weeks"]].map(([title, detail]) => <button key={title} onClick={() => showMessage(`${title} added to your roadmap`)} className="flex w-full items-center gap-3 text-left"><div className="h-10 w-10 rounded-xl bg-violet-400/15"/><div className="flex-1"><p className="text-sm font-medium">{title}</p><p className="text-xs text-slate-500">{detail}</p></div><ChevronDown className="-rotate-90 text-slate-600" size={16}/></button>)}</div><button onClick={() => { window.location.href = "/ai"; }} className="mt-6 w-full rounded-xl border border-white/10 py-2.5 text-sm text-slate-300 hover:bg-white/5">View skill roadmap</button></div></div>
        <CareerDiscovery />
      </div></section>
  </main>;
}
