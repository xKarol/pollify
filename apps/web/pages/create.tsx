import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { Alert } from "@mui/material";
import type { Poll } from "@poll/types";
import { Input, Switch } from "@poll/ui";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/form";
import Header from "../components/header";
import { routes } from "../config/routes";
import { useCreatePoll } from "../hooks/use-create-poll";
import { getErrorMessage } from "../utils/error";

// TODO reuse schema from global `schemas` package
export const createPollSchema = z.object({
  question: z.string().min(3),
  answers: z
    .array(
      z.object({
        text: z
          .string({ required_error: "Answer should not be empty" })
          .nonempty(),
      })
    )
    .min(2),
  isPublic: z.boolean().optional(),
});

type FormValues = Poll.CreatePollData;

export default function Page() {
  const router = useRouter();

  const form = useForm<FormValues>({
    // @ts-expect-error TODO FIX
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      question: "",
      answers: Array.from({ length: 2 }, () => ({ text: "" })),
      isPublic: true,
    },
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "answers",
  });
  const { mutateAsync, isLoading } = useCreatePoll();

  const onSubmit = form.handleSubmit(async (data: FormValues) => {
    try {
      console.log(data);
      const response = await mutateAsync(data);
      form.reset();
      await router.push(routes.poll(response.id));
    } catch (error) {
      form.setError("root", { message: getErrorMessage(error) });
    }
  });
  console.log(form.formState.errors);
  return (
    <>
      <NextSeo title="Create your poll" />
      <Header />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="container flex flex-col max-w-[700px]">
          {form.formState.errors.root?.message ? (
            <Alert severity="error">{form.formState.errors.root.message}</Alert>
          ) : null}
          <div className="flex flex-col space-y-1 mb-8">
            <h1 className="text-xl font-bold text-neutral-900">Create Poll</h1>
            <p className="text-lg font-medium text-neutral-400">
              Craft Your questions, gather opinions and make decisions.
            </p>
          </div>

          <div className="space-y-3 mb-8">
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

            <div className="flex flex-col space-y-3">
              {fields.map((field, index) => (
                <div key={field.id}>
                  <FormField
                    control={form.control}
                    name={`answers.${index}.text`}
                    render={({ field }) => (
                      <FormItem>
                        {index === 0 && <FormLabel>Answer options</FormLabel>}
                        <FormControl>
                          <Input
                            placeholder={`Option ${index + 1}`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              className="bg-neutral-300 text-white p-3 w-full rounded-md"
              onClick={() => append({ text: "" })}>
              Add option
            </button>
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="text-normal font-medium text-neutral-900">
              Settings
            </h2>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex bg-white flex-row items-center justify-between rounded-sm border-2 border-neutral-100 px-3 py-4">
                    <div className="space-y-2">
                      <FormLabel>Public</FormLabel>
                      <FormDescription className="text-neutral-400">
                        Make this poll public
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <LoadingButton
            className="ml-auto bg-neutral-900 text-white py-3 px-4 capitalize min-w-[100px]"
            type="submit"
            loading={isLoading}>
            Vote
          </LoadingButton>
        </form>
      </Form>
    </>
  );
}
