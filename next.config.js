// Import next-transpile-modules and Sentry
const withTM = require('next-transpile-modules')(['googleapis', 'gaxios']);
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  // Add other Next.js configuration options here
};

// Wrap the configuration with transpile-modules and Sentry
module.exports = withSentryConfig(
  withTM(nextConfig), // Add transpile-modules here
  {
    // Sentry configuration options
    org: "asheori-reactive-technology",
    project: "bookingly",
    silent: !process.env.CI,
    widenClientFileUpload: true,
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
    // Uncomment if using Sentry tunnel route
    // tunnelRoute: "/monitoring",
  }
);
