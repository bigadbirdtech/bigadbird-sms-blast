import { ReactNode } from "react";

export default function BlastLayout({ children }: { children: ReactNode }) {
    return (
        <div className="isolate flex h-svh w-full flex-col bg-slate-950 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-30 pointer-events-none" />
            <div className="relative z-10 flex-1 flex flex-col h-full w-full overflow-hidden">
                {children}
            </div>
        </div>
    );
}
