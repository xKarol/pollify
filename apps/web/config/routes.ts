type RouteValue = string | ((...args: string[]) => string);
type Route = {
  [key: string]: RouteValue | Route;
};

export const routes = {
  HOME: "/",
  CREATE_POLL: "/create",
  PRICING: "/pricing",
  FEATURES: "/features",
  EXPLORE_POLLS: "/explore",
  LOGIN: "/login",
  TERMS_AND_CONDITIONS: "/terms",
  PRIVACY_POLICY: "/privacy",
  FAQ: "/faq",
  HELP: "/help",
  CONTACT: "/contact",
  ABOUT_US: "/about-us",
  DASHBOARD: {
    HOME: "/dashboard/analytics", //alias
    POLLS: "/dashboard/polls",
    VOTES: "/dashboard/votes",
    ANALYTICS: {
      HOME: "/dashboard/analytics",
      poll: (pollId: string) => `/dashboard/analytics/poll/${pollId}` as const,
    },
  },
  SETTINGS: {
    HOME: "/settings/account/general", //alias
    ACCOUNT: {
      GENERAL: "/settings/account/general",
      EDIT: "/settings/account/edit",
    },
    PREFERENCES: {
      APPEARANCE: "/settings/preferences/appearance",
    },
    BILLING: {
      MY_PLAN: "/settings/billing/my-plan",
    },
  },
  poll: (pollId: string) => `/poll/${pollId}` as const,
} as const satisfies Route;
