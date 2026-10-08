import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const COOKIE = "blast_session";
export const MAX_AGE = 60 * 60 * 24 * 7;

const secret = () => {
  const s = process.env.AUTH_SECRET || process.env.BETTER_AUTH_SECRET;
  if (!s || s.length < 16) throw new Error("Set AUTH_SECRET (16+ chars) in .env.local");
  return s;
};
const sign = (d: string) => createHmac("sha256", secret()).update(d).digest("hex");

export const makeSession = () => {
  const body = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  return `${body}.${sign(body)}`;
};

export function validSession(token?: string) {
  const [exp, mac] = token?.split(".") ?? [];
  if (!exp || !mac) return false;
  const want = Buffer.from(sign(exp));
  const got = Buffer.from(mac);
  return want.length === got.length && timingSafeEqual(want, got) && Number(exp) > Date.now() / 1000;
}

export async function requireSession() {
  if (!validSession((await cookies()).get(COOKIE)?.value)) redirect("/login");
}
