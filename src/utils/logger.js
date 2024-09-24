import * as Sentry from "@sentry/react";

export const initLogger = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: "YOUR_SENTRY_DSN",
      integrations: [new Sentry.BrowserTracing()],
      tracesSampleRate: 1.0,
    });
  }
};

export const logError = (error, errorInfo = null) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, { extra: errorInfo });
  } else {
    console.error('Error:', error, errorInfo);
  }
};