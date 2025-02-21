import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Icon,
  LoadingButton,
  toast,
} from "@pollify/ui";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

import { useDeletePoll } from "../hooks/use-delete-poll";
import { userKeys } from "../queries/user";

type DeletePollDialogProps = {
  pollId: string;
  onDelete?: () => void;
} & React.ComponentProps<typeof Dialog>;

export default function DeletePollDialog({
  pollId,
  onDelete,
  children,
  ...props
}: DeletePollDialogProps) {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync: deletePoll } = useDeletePoll({
    onError: () => {
      toast("Something went wrong...", { variant: "error" });
    },
    onSuccess: () => {
      toast("Poll has been deleted", { variant: "success" });
      queryClient.setQueryData(userKeys.getUserPolls, (data) => {
        return {
          // @ts-ignore
          ...data,
          // @ts-ignore
          pages: data?.pages.map((page) => {
            return {
              ...page,
              data: page.data.filter((result) => result.id !== pollId),
            };
          }),
        };
      });
    },
  });
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} hideClose>
        <DialogHeader>
          <DialogTitle>Delete poll</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this poll?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="text">Cancel</Button>
          </DialogTrigger>
          <LoadingButton
            variant="destructive"
            isLoading={isLoading}
            onClick={async () => {
              await deletePoll(pollId);
              onDelete?.();
            }}>
            <Icon.Trash2 />
            <span>Delete poll</span>
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
