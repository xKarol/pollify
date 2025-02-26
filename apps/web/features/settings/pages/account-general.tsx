import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoadingButton,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@pollify/ui";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/form";
import dayjs from "../../../lib/dayjs";
import { getErrorMessage } from "../../../utils/get-error-message";
import SettingsHeader from "../components/settings-header";
import { useUpdateAccount } from "../hooks";
import { BaseLayout } from "../layouts";

export default function AccountGeneralPage() {
  const { status } = useSession();

  return (
    <BaseLayout>
      <SettingsHeader
        heading="General"
        description="Manage your account preferences"
      />
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
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <Skeleton className="h-10 w-20" />
        </div>
      ) : (
        <EditAccountForm />
      )}
    </BaseLayout>
  );
}

export const updateUserSchema = z.object({
  clockType: z.string().nonempty(),
  timeZone: z.string().nonempty(),
});

type FormValues = z.infer<typeof updateUserSchema>;

function EditAccountForm() {
  const { data: session, update } = useSession();
  const [disabled, setDisabled] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      clockType: session?.user.clockType === 12 ? "12h" : "24h",
      timeZone: session?.user.timeZone || dayjs.tz.guess(),
    },
    disabled,
  });
  const { mutateAsync: updateAccount } = useUpdateAccount();
  const hasChanges = form.formState.isDirty;

  const onSubmit = form.handleSubmit(async (payload) => {
    try {
      setDisabled(true);
      await updateAccount({
        json: {
          ...payload,
          clockType: payload.clockType === "12h" ? 12 : 24,
        },
      });
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
        <div className="mb-8 space-y-4">
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="clockType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clock type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={disabled}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue="12 hours"
                          placeholder="Select a clock type"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="12h">12 hours</SelectItem>
                      <SelectItem value="24h">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeZone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={disabled}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your timezone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* TODO optimize this */}
                      {/* @ts-ignore */}
                      {Intl.supportedValuesOf("timeZone").map((timezone) => (
                        <SelectItem key={timezone} value={timezone}>
                          {timezone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
