"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Mail, ShieldCheck, UserRound } from "lucide-react";

const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
type User = { id: string; name: string; email: string; role: string };

export default function ProfilePage() {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetch(`${api}/auth/me`, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) { window.location.assign("/login"); return; }
        const data = await response.json() as { user: User };
        setUser(data.user);
      })
      .catch(() => setError("Unable to load your profile."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-[#090b16] text-slate-300">Loading profile...</main>;
  if (error || !user) return <main className="flex min-h-screen items-center justify-center bg-[#090b16] p-5 text-rose-300">{error || "Profile unavailable"}</main>;

  const initials = user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return <main className="min-h-screen bg-[#090b16] p-5 text-white sm:p-10">
    <div className="mx-auto max-w-3xl">
      <a href="/" className="mb-8 flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft size={16}/> Back to dashboard</a>
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[.04] shadow-2xl">
        <div className="h-32 bg-gradient-to-r from-violet-600/70 via-cyan-500/40 to-violet-500/50" />
        <div className="p-6 sm:p-10">
          <div className="-mt-20 flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-8 border-[#111426] bg-gradient-to-br from-violet-400 to-cyan-400 text-3xl font-bold text-slate-950">{initials}</div>
            <div className="pb-2"><p className="text-sm text-violet-300">My profile</p><h1 className="mt-1 text-3xl font-bold">{user.name}</h1><p className="mt-1 text-sm text-slate-400">{user.role}</p></div>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><Mail className="mb-4 text-cyan-300" size={20}/><p className="text-xs uppercase tracking-wide text-slate-500">Email address</p><p className="mt-2 break-all text-sm text-slate-200">{user.email}</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><ShieldCheck className="mb-4 text-emerald-300" size={20}/><p className="text-xs uppercase tracking-wide text-slate-500">Account role</p><p className="mt-2 text-sm text-slate-200">{user.role}</p></div>
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-violet-400/20 bg-violet-400/10 p-4 text-sm text-violet-100"><UserRound size={18} className="text-violet-300"/> This profile uses your authenticated account information.</div>
        </div>
      </section>
    </div>
  </main>;
}
