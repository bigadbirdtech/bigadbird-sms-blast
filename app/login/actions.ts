"use server";

import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, MAX_AGE, makeSession } from "@/lib/session";

const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

export async function login(_: string | null, form: FormData) {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const pw = String(form.get("password") ?? "");
  const wantEmail = (process.env.APP_EMAIL ?? "").toLowerCase();
  const wantPw = process.env.APP_PASSWORD ?? "";
  if (!wantPw || !same(email, wantEmail) || !same(pw, wantPw)) return "Wrong email or password";
  (await cookies()).set(COOKIE, makeSession(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: MAX_AGE });
  redirect("/sms");
}

export async function logout() {
  (await cookies()).delete(COOKIE);
  redirect("/sms/login");
}
