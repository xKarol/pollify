import {
  getUserPollCountriesKey,
  getUserPollCountriesOptions,
} from "../features/dashboard/hooks/use-analytics-countries";
import {
  getAnalyticsDevicesKey,
  getAnalyticsDevicesOptions,
} from "../features/dashboard/hooks/use-analytics-devices";
import {
  getAnalyticsVotesKey,
  getAnalyticsVotesOptions,
} from "../features/dashboard/hooks/use-analytics-votes";

export const analyticsKeys = {
  getUserPollsVotes: getAnalyticsVotesKey,
  getUserPollTopDevices: getAnalyticsDevicesKey,
  getUserPollTopCountries: getUserPollCountriesKey,
};

export const analyticsOptions = {
  getUserPollsVotes: getAnalyticsVotesOptions,
  getUserPollTopDevices: getAnalyticsDevicesOptions,
  getUserPollTopCountries: getUserPollCountriesOptions,
} satisfies Record<keyof typeof analyticsKeys, unknown>;
