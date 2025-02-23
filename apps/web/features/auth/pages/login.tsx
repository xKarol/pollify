import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  AlertTitle,
  Input,
  LoadingButton,
  Separator,
} from "@pollify/ui";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/form";
import { routes } from "../../../config/routes";
import { getErrorMessage } from "../../../utils/get-error-message";
import { AuthProvider } from "../components";
import { useSignIn } from "../hooks/use-sign-in";

type FormValues = {
  email: string;
  password: string;
};

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginPage() {
  const router = useRouter();
  const {
    mutateAsync: signIn,
    isLoading,
    error,
  } = useSignIn({
    redirectUrl: router.query.redirect as string | undefined,
  });
  const form = useForm<FormValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data: FormValues) => {
    try {
      console.log(data);
      await signIn({
        provider: "credentials",
        data: {
          email: data.email,
          password: data.password,
        },
      });
      form.reset();
    } catch (error) {
      form.setError("root", { message: getErrorMessage(error) });
    }
  });

  return (
    <div className="container">
      <div className="mx-auto my-16 flex max-w-[360px] flex-col">
        {error || form.formState.errors.root?.message ? (
          <Alert variant="error" className="mb-8">
            <AlertTitle>
              {error
                ? getErrorMessage(error) || form.formState.errors.root.message
                : null}
            </AlertTitle>
          </Alert>
        ) : null}
        <h1 className="mb-16 text-center text-3xl font-medium">Log In</h1>
        <AuthProvider
          variant="google"
          isLoading={isLoading.google}
          onClick={() => signIn({ provider: "google" })}
        />
        <Separator className="mb-8 mt-12" />
        <div className="flex flex-col space-y-16">
          <div className="flex flex-col justify-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email address..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••••"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <LoadingButton
                  isLoading={false}
                  type="submit"
                  className="w-full rounded-xl">
                  Submit
                </LoadingButton>
                <Link
                  href="/"
                  className="text-accent ml-auto text-center text-xs font-medium">
                  Forgot Password?
                </Link>
              </form>
            </Form>
          </div>
          <span className="text-accent text-center text-sm font-normal [&>a]:underline">
            By logging in, you agree to our{" "}
            <Link href={routes.TERMS_AND_CONDITIONS}>Terms and Conditions</Link>
            , including our{" "}
            <Link href={routes.PRIVACY_POLICY}>Privacy Policy</Link>.
          </span>
        </div>
      </div>
    </div>
  );
}
