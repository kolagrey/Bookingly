import { onCLS, onFID, onLCP, onFCP, onTTFB, Metric } from "web-vitals";
import { captureException } from "./sentry";

declare global {
  interface Navigator {
    connection?: {
      effectiveType: string;
    };
  }
}
const vitalsUrl = "https://vitals.vercel-analytics.com/v1/vitals";

function getConnectionSpeed(): string {
  if (!navigator.connection) return "unknown";
  return (navigator.connection as any)?.effectiveType || "unknown";
}

const sendToAnalytics = (metric: Metric, options: { path: string }) => {
  const body: Record<string, string> = {
    id: metric.id,
    page: options.path,
    href: location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  };
  // Conditionally add 'dsn' only if it's defined
  if (process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID) {
    body.dsn = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID;
  }

  if (process.env.NODE_ENV === "production") {
    const blob = new Blob([new URLSearchParams(body).toString()], {
      type: "application/x-www-form-urlencoded",
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(vitalsUrl, blob);
    } else {
      fetch(vitalsUrl, {
        body: blob,
        method: "POST",
        credentials: "omit",
        keepalive: true,
      }).catch((error) => {
        captureException(error);
      });
    }
  }
};

export function reportWebVitals(options: { path: string }) {
  try {
    onFID((metric) => sendToAnalytics(metric, options));
    onTTFB((metric) => sendToAnalytics(metric, options));
    onLCP((metric) => sendToAnalytics(metric, options));
    onCLS((metric) => sendToAnalytics(metric, options));
    onFCP((metric) => sendToAnalytics(metric, options));
  } catch (err) {
    captureException(err as Error);
  }
}
