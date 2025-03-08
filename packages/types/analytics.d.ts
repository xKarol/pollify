export type GetPollData = {
  pollId: string;
};

export type Devices = "mobile" | "tablet" | "desktop";
export type GroupBy = "month" | "day" | "hour" | "minute";
export type Interval = "1h" | "24h" | "7d" | "30d" | "1y";
export type VotesData = { date: string; amount: number };

export type TopCountriesData = {
  country_name: string;
  country_code: string;
  total: number;
};

export type TopDevicesData = Record<Devices, number>;

export type ClientAnalyticsParams = {
  pollId?: string;
  dateFrom?: number;
  dateTo?: number;
  limit?: number;
  interval?: string;
};

export type AnalyticsParams<TParams = Record<string, unknown>> = Required<
  Omit<ClientAnalyticsParams, "interval" | "pollId">
> & {
  pollId?: string;
  ownerId: string;
} & TParams;

type TinyBirdResponse<TData extends Record<string, unknown>> = {
  data: TData;
  meta: {
    name: string;
    type: string;
  }[];
  rows?: number | undefined;
  rows_before_limit_at_least?: number | undefined;
  statistics?:
    | {
        elapsed?: number | undefined;
        rows_read?: number | undefined;
        bytes_read?: number | undefined;
      }
    | undefined;
};

// Frontend
export interface Api {
  getUserPollVotes: (
    params?: ClientAnalyticsParams
  ) => Promise<ApiResponse["getUserPollVotes"]>;
  getUserPollTopDevices: (
    params?: ClientAnalyticsParams
  ) => Promise<ApiResponse["getUserPollTopDevices"]>;
  getUserPollTopCountries: (
    params?: ClientAnalyticsParams
  ) => Promise<ApiResponse["getUserPollTopCountries"]>;
}

// Backend
export interface Services {
  getUserPollVotes: (
    params: AnalyticsParams<{
      groupBy: GroupBy;
    }>
  ) => Promise<TinyBirdResponse<ApiResponse["getUserPollVotes"]>>;
  getUserPollTopDevices: (
    params: AnalyticsParams
  ) => Promise<TinyBirdResponse<{ device: Devices; total: number }[]>>;
  getUserPollTopCountries: (
    params: AnalyticsParams
  ) => Promise<TinyBirdResponse<ApiResponse["getUserPollTopCountries"]>>;
}

export type ApiResponse = {
  getUserPollVotes: VotesData[];
  getUserPollTopDevices: TopDevicesData;
  getUserPollTopCountries: TopCountriesData[];
};
