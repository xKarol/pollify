import {
  getUserPollTopCountriesKey,
  getUserPollTopCountriesOptions,
} from "../features/dashboard/hooks/use-analytics-top-countries";
import {
  getUserPollTopDevicesKey,
  getUserPollTopDevicesOptions,
} from "../features/dashboard/hooks/use-analytics-top-devices";
import {
  getUserPollsVotesKey,
  getUserPollsVotesOptions,
} from "../features/dashboard/hooks/use-analytics-votes";

export const analyticsKeys = {
  getUserPollsVotes: getUserPollsVotesKey,
  getUserPollTopDevices: getUserPollTopDevicesKey,
  getUserPollTopCountries: getUserPollTopCountriesKey,
};

export const analyticsOptions = {
  getUserPollsVotes: getUserPollsVotesOptions,
  getUserPollTopDevices: getUserPollTopDevicesOptions,
  getUserPollTopCountries: getUserPollTopCountriesOptions,
} satisfies Record<keyof typeof analyticsKeys, unknown>;
