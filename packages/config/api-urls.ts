type RouteValue = string | ((...args: string[]) => string);
type Route = {
  [key: string]: RouteValue | Route;
};

export const apiUrls = {
  users: {
    delete: "/me",
    update: "/me",
    getPolls: "/me/polls",
    getVotes: "/me/votes",
  },
  polls: {
    getOne: (pollId) => `/polls/${pollId}` as const,
    getAll: "/polls",
    create: "/polls",
    delete: (pollId) => `/polls/${pollId}` as const,
    vote: (pollId, answerId) => `/polls/${pollId}/vote/${answerId}` as const,
    getVoters: (pollId) => `/polls/${pollId}/voters` as const,
    getUserSelection: (pollId) => `/polls/${pollId}/user-selection` as const,
    getLiveResults: (pollId) => `/polls/${pollId}/live` as const,
    analytics: {
      getVotes: "/polls/analytics/votes",
      getDevices: "/polls/analytics/devices",
      getCountries: "/polls/analytics/countries",
      export: "/polls/analytics/export",
    },
  },
  payments: {
    getPricingPlans: "/payments/plans",
    checkoutSession: "/payments/checkout-sessions",
  },
  qr: {
    getQRCode: `/qr`,
  },
  webhooks: {
    stripe: "/webhooks/stripe",
  },
} as const satisfies Route;
