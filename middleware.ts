import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { createJimmyKey } from "@/app/_utils/jimmyKeyUtils";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

const ratelimit = new Ratelimit({
  redis: kv,
  // You might want to adjust these limits as needed for session-specific routes
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

// Update the matcher to only include /api/session/ routes
export const config = {
  matcher: ["/api/session/:path*"],
};

export default async function middleware(request: NextRequest) {
  // Only apply rate limiting to /api/session/ routes
  if (request.nextUrl.pathname.startsWith("/api/session/")) {
    const ip = request.ip ?? "127.0.0.1";
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      console.error(
        "Rate limit exceeded for IP:",
        ip,
        "on route:",
        request.nextUrl.pathname
      );
      await fetch(`${NEXT_PUBLIC_API_URL}/api/utility/send-slack-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-jimmy-key": createJimmyKey().encryptedData,
        },
        body: JSON.stringify({
          message: "🚨 Rate Limit Triggered",
          errorDetails: `Rate limit exceeded for IP: ${ip} on route: ${request.nextUrl.pathname}`,
          userInfo: { ip, route: request.nextUrl.pathname },
        }),
      });
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  }

  // All other routes proceed without rate limiting
  return NextResponse.next();
}
