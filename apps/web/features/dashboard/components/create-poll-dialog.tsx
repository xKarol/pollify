import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  ScrollArea,
} from "@pollify/ui";
import React from "react";

import { CreatePollForm } from "../../../components/create-poll-form";

export const CreatePollDialog = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent hideClose className="px-0">
        <ScrollArea className="h-[80vh] px-6">
          <CreatePollForm
            ActionButtons={[
              <Button variant="text" key="close-modal-btn" asChild>
                <DialogTrigger>Close</DialogTrigger>
              </Button>,
            ]}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
