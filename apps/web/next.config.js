/* eslint-disable @typescript-eslint/no-var-requires */
const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@pollify/ui"],
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  async rewrites() {
    return {
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
};

/** @type {import('@sentry/nextjs').SentryWebpackPluginOptions} */
const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  hideSourceMaps: true,
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(
  withSentryConfig(nextConfig, sentryWebpackPluginOptions)
);
