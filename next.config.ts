import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
  // Next.js caps Server Action request bodies at 1MB by default. Every admin
  // form that uploads a photo (products, homepage philosophy banner) easily
  // exceeds that with an un-resized phone photo — the action then fails
  // server-side and the client shows a generic crash screen with nothing
  // saved. Raised to fit real-world image sizes.
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
