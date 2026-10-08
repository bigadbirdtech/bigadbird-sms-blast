import type { NextConfig } from "next";

// Served under /sms so it can live inside the HQ subdomain (the CRM app proxies /sms/* to this one).
const BASE = "/sms";

const nextConfig: NextConfig = {
  basePath: BASE,
  env: { NEXT_PUBLIC_BASE: BASE },
  turbopack: {
    rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } },
  },
};

export default nextConfig;
