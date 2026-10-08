import { Chat, PhoneOutgoing } from "@carbon/icons-react";
import Link from "next/link";
import { logout } from "./login/actions";

const CRM_URL = process.env.CRM_URL || "/hq";

export default function Home() {
  const card = "block rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-0.5 hover:bg-white/10";
  return (
    <main className="mx-auto grid min-h-screen max-w-3xl place-content-center gap-4 px-4">
      <h1 className="mb-2 text-center text-2xl font-bold">SMS Blast</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/main/blast" className={card}><Chat size={24} /><div className="mt-8 font-semibold">Blast</div><div className="text-sm text-slate-400">Campaigns, lists, replies</div></Link>
        <Link href="/main/calling" className={card}><PhoneOutgoing size={24} /><div className="mt-8 font-semibold">Calling</div><div className="text-sm text-slate-400">AI voice calls and recordings</div></Link>
      </div>
      <div className="flex justify-center gap-4 text-xs text-slate-400">
        <a href={CRM_URL} className="hover:text-white">← Back to HQ</a>
        <form action={logout}><button className="hover:text-white">Sign out</button></form>
      </div>
    </main>
  );
}
