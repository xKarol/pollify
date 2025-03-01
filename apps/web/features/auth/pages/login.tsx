import { zodResolver } from "@hookform/resolvers/zod";
import { Input, LoadingButton, Separator } from "@pollify/ui";
import Link from "next/link";
import { useRouter } from "next/router";
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
  const { mutateAsync: signIn, isLoading } = useSignIn({
    redirectUrl: router.query.redirect as string | undefined,
  });
  const form = useForm<FormValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await signIn({
        provider: "credentials",
        data: {
          email: data.email,
          password: data.password,
        },
      });
      form.reset();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  return (
    <div className="container">
      <div className="mx-auto my-16 flex max-w-[360px] flex-col">
        <h1 className="mb-16 text-center text-3xl font-medium">Log In</h1>
        <div className="flex flex-col space-y-2">
          <AuthProvider
            variant="google"
            isLoading={isLoading.google}
            onClick={() => signIn({ provider: "google" })}
          />
          <AuthProvider
            variant="apple"
            isLoading={isLoading.apple}
            onClick={() => signIn({ provider: "apple" })}
          />
          <AuthProvider
            variant="facebook"
            isLoading={isLoading.facebook}
            onClick={() => signIn({ provider: "facebook" })}
          />
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col space-y-16">
          <div className="flex flex-col justify-center">
            <Form {...form}>
              <form onSubmit={onSubmit} className="flex flex-col space-y-4">
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
