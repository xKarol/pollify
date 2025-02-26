import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@pollify/types";
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
  Input,
  LoadingButton,
  Separator,
  Skeleton,
} from "@pollify/ui";
import { UserValidator } from "@pollify/validations";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/form";
import { getErrorMessage } from "../../../utils/get-error-message";
import SettingsHeader from "../components/settings-header";
import { useDeleteAccount, useUpdateAccount } from "../hooks";
import { BaseLayout } from "../layouts";

type FormValues = User.UpdateUserData;

export default function AccountEditPage() {
  const { status } = useSession();

  return (
    <BaseLayout>
      <SettingsHeader heading="Edit" description="Edit your account" />
      {status !== "authenticated" ? (
        <div className="flex flex-col space-y-3">
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <Skeleton className="h-10 w-20" />
        </div>
      ) : (
        <div>
          <EditAccountForm />
          <Separator className="my-8" />
          <DangerZone />
        </div>
      )}
    </BaseLayout>
  );
}

function EditAccountForm() {
  const { data: session, update } = useSession();
  const [disabled, setDisabled] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(UserValidator.updateUserSchema),
    defaultValues: {
      email: session?.user.email ?? "",
      name: session?.user.name ?? "",
    },
    disabled,
  });
  const { mutateAsync: updateAccount } = useUpdateAccount();
  const hasChanges = form.formState.isDirty;

  const onSubmit = form.handleSubmit(async (payload) => {
    try {
      setDisabled(true);
      await updateAccount({ json: payload });
      await update();
      toast.success("Account updated successfully.");
      form.reset(payload);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDisabled(false);
    }
  });
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className={"flex flex-col"}>
        <div className="space-y-4">
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <LoadingButton
            type="submit"
            disabled={!hasChanges}
            isLoading={disabled}>
            Update
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}

function DangerZone() {
  const { isPending, mutate: deleteAccount } = useDeleteAccount();

  return (
    <div className="flex flex-col space-y-2 text-red-500 dark:text-red-700">
      <h2 className="font-medium">Danger zone</h2>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" className="max-w-max">
            <Icon.Trash2 />
            <span>Delete account</span>
          </Button>
        </DialogTrigger>
        <DialogContent hideClose>
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="text" asChild>
              <DialogTrigger>Cancel</DialogTrigger>
            </Button>
            <LoadingButton
              variant="destructive"
              isLoading={isPending}
              onClick={() => deleteAccount({})}>
              <Icon.Trash2 />
              <span>Delete account</span>
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
