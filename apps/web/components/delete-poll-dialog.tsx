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
} from "@pollify/ui";
import React from "react";
import { toast } from "sonner";

import { useDeletePoll } from "../hooks/use-delete-poll";
import { getErrorMessage } from "../utils/get-error-message";

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
  const { isPending, mutateAsync: deletePoll } = useDeletePoll({
    onSuccess: () => {
      toast.success("Poll has been deleted");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
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
            isLoading={isPending}
            onClick={async () => {
              await deletePoll({ param: { pollId } });
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
