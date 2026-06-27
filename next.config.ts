import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  // Exclude large public/images from the server function bundle.
  // Images are served as static CDN assets — no need to trace them
  // into the server-side lambda (which has a ~50MB size limit on Netlify).
  outputFileTracingExcludes: {
    "*": [
      "./public/images/**/*",
    ],
  },
};

export default nextConfig;

