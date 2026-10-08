import type { ButtonHTMLAttributes } from "react";

const variants = {
  default: "bg-white text-slate-900 hover:bg-white/90",
  outline: "border border-white/15 bg-transparent hover:bg-white/10",
  ghost: "bg-transparent hover:bg-white/10",
};
const sizes = { default: "h-9 px-4 text-sm", sm: "h-8 px-3 text-xs" };

export function Button({ variant = "default", size = "default", className = "", ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants; size?: keyof typeof sizes }) {
  return <button {...p} className={`inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`} />;
}
