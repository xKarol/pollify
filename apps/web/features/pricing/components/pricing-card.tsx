import { cn } from "@poll/lib";
import { LoadingButton, toast } from "@poll/ui";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { routes } from "../../../config/routes";
import { usePurchasePlan } from "../../../hooks/use-purchase-plan";
import { getBaseUrl } from "../../../utils/get-base-url";

export type PricingCardProps = React.ComponentPropsWithoutRef<"div"> & {
  priceId: string;
  price: number;
  currencySymbol: string;
  interval: "month" | "year";
  planName: string;
  variant: "default" | "recommended";
  description: string;
  features: { icon: React.ReactNode; text: string }[];
};

export function PricingCard({
  priceId,
  price,
  currencySymbol,
  interval,
  planName,
  variant,
  description,
  features,
  className,
  ...props
}: PricingCardProps) {
  const router = useRouter();
  const { status, data: session } = useSession();

  const { mutateAsync: purchasePlan, isLoading } = usePurchasePlan({
    onError(err) {
      toast(err?.message || "Something went wrong...", { variant: "error" }); //TODO improve error message
    },
  });
  const user = session?.user;
  const isCurrentPlan = user?.plan.toLowerCase() === planName.toLowerCase();
  const isDisabled = isLoading || isCurrentPlan;

  const handleBuyPlan = async () => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      return router.push(routes.LOGIN, {
        query: {
          redirect: `${getBaseUrl()}${routes.PRICING}`,
        },
      });
    }
    const data = await purchasePlan({ priceId });
    router.push(data.url);
  };

  return (
    <div
      className={cn(
        "dark:bg-dark flex min-w-[240px] flex-col justify-between rounded-[8px] border-2 border-neutral-100 bg-white px-4 py-8 dark:border-neutral-800",
        className
      )}
      {...props}>
      <div className="mb-6 space-y-4">
        <div>
          <h2 className="mb-4 text-xl font-medium capitalize">{planName}</h2>

          <p className="mb-2 text-xl font-medium">
            {currencySymbol}
            {price}{" "}
            <span className="text-base text-neutral-400">
              per {interval === "month" ? "month" : "year"}
            </span>
          </p>
          <p className="mb-2 text-base font-medium text-neutral-500">
            {description}
          </p>
        </div>
        <ul className="space-y-2">
          {features.map((feature) => (
            <li
              key={feature.text}
              className="flex items-center space-x-4 text-sm">
              {/* TODO fix icon from props */}
              {/* {feature.icon} */}
              <Check />
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <LoadingButton
        disabled={isDisabled}
        isLoading={isLoading}
        variant={variant === "default" ? "default" : "secondary"}
        className="mt-6 w-full"
        onClick={handleBuyPlan}>
        {isCurrentPlan ? "Current Plan" : "Get started"}
      </LoadingButton>
    </div>
  );
}
