type RouteValue = string | ((...args: string[]) => string);
type Route = {
  [key: string]: RouteValue | Route;
};

export const apiUrls = {
  user: {
    getCurrentUser: "/me",
    delete: "/me",
    update: "/me",
    getPolls: "/me/poll",
    getVotes: "/me/vote",
  },
  poll: {
    getOne: (pollId) => `/polls/${pollId}` as const,
    getAll: "/polls",
    create: "/polls",
    delete: (pollId) => `/polls/${pollId}` as const,
    vote: (pollId, answerId) => `/polls/${pollId}/vote/${answerId}` as const,
    getVoters: (pollId) => `/polls/${pollId}/voters` as const,
    getUserSelection: (pollId) => `/polls/${pollId}/user-selection` as const,
    getLiveResults: (pollId) => `/polls/${pollId}/live` as const,
  },
  payment: {
    getPricingPlans: "/payments/plans",
    checkoutSession: "/payments/checkout-sessions",
  },
  analytics: {
    userPollVotes: "/analytics/poll/vote",
    getUserPollTopDevices: "/analytics/poll/top-devices",
    getUserPollTopCountries: "/analytics/poll/top-countries",
  },
  qr: {
    getQRCode: `/qr`,
  },
  webhooks: {
    stripe: "/webhooks/stripe",
  },
} as const satisfies Route;
