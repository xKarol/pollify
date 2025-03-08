import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Icon,
  LoadingButton,
  ToggleGroup,
  ToggleGroupItem,
} from "@pollify/ui";
import type { InferRequestType } from "hono";
import React, { useState } from "react";
import { toast } from "sonner";

import type { client } from "../../../services/api";
import { getErrorMessage } from "../../../utils/get-error-message";
import { useAnalyticsContext } from "../context";
import { useExportAnalytics } from "../hooks/use-export-analytics";

type ExportTypes = InferRequestType<
  typeof client.api.polls.analytics.export.$get
>["query"]["type"];
type ExportFormats = InferRequestType<
  typeof client.api.polls.analytics.export.$get
>["query"]["format"];

function AnalyticsExportDialog() {
  const [type, setType] = useState<ExportTypes>("devices");
  const [format, setFormat] = useState<ExportFormats>("csv");
  const { interval, pollId } = useAnalyticsContext();

  const { isPending, mutateAsync: exportAnalytics } = useExportAnalytics(
    {
      pollId,
      interval: interval,
    },
    {
      onError(error) {
        toast.error(getErrorMessage(error));
      },
    }
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl px-3">
          <Icon.Download size={16} />
          <span className="hidden sm:block">Export</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export data</DialogTitle>

          <div className="flex flex-col space-y-4 py-8">
            <div className="flex flex-col space-y-2">
              <span className="text-accent text-sm">Type</span>
              <ToggleGroup
                variant="outline"
                value={type}
                onValueChange={(val) => {
                  if (!val) return;
                  // @ts-ignore
                  setType(val);
                }}
                type="single">
                <ToggleGroupItem className="flex-1" value="devices">
                  Devices
                </ToggleGroupItem>
                <ToggleGroupItem className="flex-1" value="votes">
                  Votes
                </ToggleGroupItem>
                <ToggleGroupItem className="flex-1" value="countries">
                  Countries
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="text-accent text-sm">Format</span>
              <ToggleGroup
                variant="outline"
                value={format}
                onValueChange={(val) => {
                  if (!val) return;
                  // @ts-ignore
                  setFormat(val);
                }}
                type="single">
                <ToggleGroupItem className="flex-1" value="csv">
                  CSV
                </ToggleGroupItem>
                <ToggleGroupItem className="flex-1" value="json">
                  JSON
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
          <LoadingButton
            type="button"
            onClick={() => exportAnalytics({ query: { type, format } })}
            isLoading={isPending}>
            Download
          </LoadingButton>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AnalyticsExportDialog;
