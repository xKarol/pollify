import type { Analytics } from "@pollify/types";
import { useMutation } from "@tanstack/react-query";

import { client } from "../../../services/api";
import type { HookMutationOptions } from "../../../types";

const $get = client.api.polls.analytics.export.$get;

export const useExportAnalytics = (
  params: Analytics.ClientAnalyticsParams,
  options?: HookMutationOptions<typeof $get>
) => {
  return useMutation({
    ...options,
    // @ts-ignore
    mutationFn: async (data) => {
      const response = await $get({ query: { ...data.query, ...params } });
      const contentDisposition = response.headers.get("Content-Disposition");
      if (contentDisposition && contentDisposition.includes("attachment")) {
        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const filename = contentDisposition
          .split("filename=")[1]
          .replace(/"/g, "");

        a.download = filename;
        a.click();

        window.URL.revokeObjectURL(url);
      } else {
        return response.json();
      }
    },
  });
};
