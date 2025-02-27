import bundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@pollify/ui"],
  async rewrites() {
    return {
      afterFiles: [],
      fallback: [],
      beforeFiles: [
        {
          source: "/dashboard",
          destination: "/dashboard/analytics",
        },
        {
          source: "/settings",
          destination: "/settings/account/general",
        },
      ],
    };
  },
  eslint: {
    ignoreDuringBuilds: process.env.ESLINT_IGNORE_BUILD_ERRORS === "true",
  },
  typescript: {
    ignoreBuildErrors: process.env.TYPESCRIPT_IGNORE_BUILD_ERRORS === "true",
  },
};

export default withBundleAnalyzer(
  withSentryConfig(nextConfig, {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,
    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,
    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  })
);
