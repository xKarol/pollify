import { queryOptions, useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";

import { client } from "../services/api";

const $get = client.api.qr.$get;

export const getQRCodeKey = (text: string) => ["qr", { text }] as const;

export const getQRCodeOptions = (
  text: string,
  options?: UseQueryOptions<string>
) => {
  return queryOptions({
    // @ts-expect-error
    cacheTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    ...options,
    queryKey: getQRCodeKey(text),
    queryFn: async () => {
      const response = await $get({
        query: { text: encodeURIComponent(text) },
      });
      const buffer = await response.arrayBuffer();
      return `data:image/svg+xml;base64,${Buffer.from(buffer).toString(
        "base64"
      )}`;
    },
  });
};

// hook
export const useQRCode = (...args: Parameters<typeof getQRCodeOptions>) => {
  return useQuery(getQRCodeOptions(...args));
};
