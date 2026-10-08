import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE, validSession } from "@/lib/session";

// Everything needs a login except the login page and the Telnyx webhook (Telnyx cannot log in).
// ponytail: the webhook is unauthenticated; verify TELNYX_PUBLIC_KEY signatures before going live.
export function proxy(req: NextRequest) {
  if (validSession(req.cookies.get(COOKIE)?.value)) return NextResponse.next();
  const url = req.nextUrl.clone(); // keeps the /sms base path
  url.pathname = "/login";
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/((?!login|api/webhooks|_next/static|_next/image|favicon.ico).*)"] };
