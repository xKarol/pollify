import { zodResolver } from "@hookform/resolvers/zod";
import { MAX_POLL_OPTIONS } from "@pollify/config";
import type { Plans } from "@pollify/db/types";
import { cn } from "@pollify/lib";
import type { Poll } from "@pollify/types";
import {
  Button,
  LoadingButton,
  Input,
  Switch,
  Icon,
  Badge,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  ScrollArea,
} from "@pollify/ui";
import { PollValidator } from "@pollify/validations";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/form";
import { routes } from "../config/routes";
import { useCreatePoll } from "../hooks/use-create-poll";
import { useHasPermission } from "../hooks/use-has-permission";
import { getErrorMessage } from "../utils/get-error-message";

export type CreatePollFormProps = { ActionButtons?: JSX.Element[] } & Omit<
  React.ComponentPropsWithoutRef<"form">,
  "children"
>;

type FormValues = Poll.CreatePollData;

export const CreatePollForm = ({
  className,
  ActionButtons = [],
  ...props
}: CreatePollFormProps) => {
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(PollValidator.createPollSchema),
    defaultValues: {
      question: "",
      answers: Array.from({ length: 2 }, () => ({ text: "" })),
      isPublic: true,
    },
    disabled: disabled,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "answers",
  });
  const { mutateAsync: createPoll } = useCreatePoll();

  const onSubmit = form.handleSubmit(async (payload) => {
    try {
      setDisabled(true);
      const response = await createPoll({ json: payload });
      await router.push(routes.poll(response.id));
      toast.success("Poll created successfully!");
      form.reset();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDisabled(false);
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className={cn("flex flex-col", className)}
        {...props}>
        <div className="mb-8 flex flex-col space-y-2">
          <h1 className="text-2xl font-medium lg:text-3xl">Create Poll</h1>
          <p className="text-accent lg:text-lg">
            Set up a poll to get opinions, see different viewpoints, and make
            better decisions.
          </p>
        </div>

        <div className="mb-8 space-y-3">
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question</FormLabel>
                <FormControl>
                  <Input placeholder="Your question..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-3">
            <FormLabel>Answer options</FormLabel>
            <ScrollArea className="max-h-96 overflow-auto">
              {/* TODO replace default scrollbar with custom */}
              <div className="flex flex-col space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id}>
                    <FormField
                      control={form.control}
                      name={`answers.${index}.text`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder={`Option ${index + 1}`}
                              {...field}
                              RightIcon={
                                fields.length > 2 && !disabled ? (
                                  <Icon.X onClick={() => remove(index)} />
                                ) : null
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {fields.length !== MAX_POLL_OPTIONS ? (
            <Button
              disabled={disabled}
              type="button"
              className="w-full rounded-xl bg-neutral-200 text-neutral-900 hover:bg-neutral-200/50 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-800/90"
              onClick={() => append({ text: "" })}>
              Add another option
            </Button>
          ) : null}
        </div>

        <div className="mb-8 space-y-2">
          <h2 className="text-base font-medium">Settings</h2>
          <div className="space-y-2">
            <PollOptionField
              control={form.control}
              disabled={disabled}
              name="isPublic"
              IconElement={<Icon.Globe className="size-7 lg:size-8" />}
              heading="Make public"
              description="Allow anyone to view and vote"
            />
            <PollOptionField
              requiredPlan={"basic"}
              control={form.control}
              disabled={disabled}
              name="requireRecaptcha"
              IconElement={<Icon.Shield className="size-7 lg:size-8" />}
              heading="Spam Protection"
              description="Protect your poll from bot spam"
            />
          </div>
        </div>

        <div className="ml-auto flex space-x-2">
          {ActionButtons.map((Button) => Button)}
          <LoadingButton
            className="min-w-[100px]"
            type="submit"
            isLoading={disabled}>
            Create
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

type PollOptionFieldProps = {
  IconElement: JSX.Element;
  heading: string;
  requiredPlan?: Plans;
  description: string;
} & Omit<React.ComponentProps<typeof FormField<FormValues>>, "render">;

function PollOptionField({
  IconElement,
  heading,
  description,
  requiredPlan = "free",
  disabled,
  ...props
}: PollOptionFieldProps) {
  const { hasPermission } = useHasPermission();
  const hasAccess = hasPermission(requiredPlan);
  return (
    <>
      <FormField
        {...props}
        render={({ field }) => (
          <FormItem className="border-border bg-foreground flex items-center justify-between rounded-2xl border px-4 py-5 lg:p-6">
            <div className="flex items-center space-x-3">
              {IconElement}
              <div>
                <FormLabel className="inline-flex items-center space-x-2">
                  <span className="text-base font-medium lg:text-lg">
                    {heading}
                  </span>
                  {!hasAccess ? (
                    <Badge className="capitalize">
                      <Icon.Gem />
                      <span>{requiredPlan.toLowerCase()}</span>
                    </Badge>
                  ) : null}
                </FormLabel>
                <FormDescription className="text-sm font-normal lg:text-base">
                  {description}
                </FormDescription>
              </div>
            </div>
            <FormControl>
              <Tooltip open={disabled || hasAccess ? false : undefined}>
                <TooltipTrigger asChild>
                  <div>
                    <Switch
                      disabled={disabled || !hasAccess}
                      checked={field.value as boolean}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  Basic or higher plan is required to change this option.
                </TooltipContent>
              </Tooltip>
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
}
