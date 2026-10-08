"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function Login() {
  const [err, act, pending] = useActionState(login, null);
  const input = "w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/40";
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form action={act} className="w-full max-w-sm space-y-3 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h1 className="text-lg font-bold">BIG AD BIRD <span className="text-slate-400">SMS Blast</span></h1>
        <input name="email" type="email" required placeholder="Email" autoComplete="username" className={input} />
        <input name="password" type="password" required placeholder="Password" autoComplete="current-password" className={input} />
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button disabled={pending} className="w-full rounded-xl bg-white py-2 text-sm font-semibold text-slate-900 disabled:opacity-60">Sign in</button>
      </form>
    </main>
  );
}
