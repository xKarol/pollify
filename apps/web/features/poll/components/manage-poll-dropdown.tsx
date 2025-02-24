import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
} from "@pollify/ui";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import DeletePollDialog from "../../../components/delete-poll-dialog";
import { routes } from "../../../config/routes";

export type ManagePollDropdownProps = {
  pollId: string;
  trigger: React.ReactNode;
} & Omit<React.ComponentProps<typeof DropdownMenu>, "children">;

export const ManagePollDropdown = ({
  pollId,
  trigger,
  ...rest
}: ManagePollDropdownProps) => {
  const router = useRouter();

  return (
    <DropdownMenu {...rest}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="space-x-2" asChild>
          <Link href={routes.DASHBOARD.ANALYTICS.poll(pollId)}>
            <Icon.BarChart2 className="size-4" />
            <span>Analytics</span>
          </Link>
        </DropdownMenuItem>
        <DeletePollDialog
          pollId={pollId}
          onDelete={() => {
            if (router.asPath === routes.poll(pollId)) {
              router.replace(routes.HOME);
            }
          }}>
          <DropdownMenuItem
            className="text-danger space-x-2"
            onSelect={(e) => e.preventDefault()}>
            <Icon.Trash2 className="size-4" />
            <span>Delete poll</span>
          </DropdownMenuItem>
        </DeletePollDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
