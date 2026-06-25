import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Exclude large public/images from the server function bundle.
  // Images are served as static CDN assets — no need to trace them
  // into the server-side lambda (which has a ~50MB size limit on Netlify).
  experimental: {
    outputFileTracingExcludes: {
      "*": [
        "./public/images/**/*",
      ],
    },
  },
};

export default nextConfig;
