import { cn } from "@pollify/lib";
import { Icon, LoadingButton } from "@pollify/ui";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "sonner";

import { routes } from "../../../config/routes";
import { usePurchasePlan } from "../../../hooks/use-purchase-plan";
import { getBaseUrl } from "../../../utils/get-base-url";
import { getErrorMessage } from "../../../utils/get-error-message";

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

  const { mutateAsync: purchasePlan, isPending } = usePurchasePlan({
    onError(error) {
      toast.error(getErrorMessage(error));
    },
  });
  const user = session?.user;
  const isCurrentPlan = user?.plan.toLowerCase() === planName.toLowerCase();
  const isDisabled = isPending || isCurrentPlan;

  const handleBuyPlan = async () => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      return router.push(routes.LOGIN, {
        query: {
          redirect: `${getBaseUrl()}${routes.PRICING}`,
        },
      });
    }
    const data = await purchasePlan({ json: { priceId } });
    router.push(data.url);
  };

  return (
    <div
      className={cn(
        "bg-foreground border-border flex min-w-[240px] flex-col justify-between rounded-2xl border p-6",
        className
      )}
      {...props}>
      <div className="mb-6 space-y-4">
        <div>
          <h2 className="mb-16 text-lg font-medium capitalize">{planName}</h2>

          <p className="mb-2 font-medium">
            <span className="mr-1 text-4xl">
              {currencySymbol}
              {price}
            </span>
            <span className="text-accent text-sm">
              /{interval === "month" ? "month" : "year"}
            </span>
          </p>

          <p className="text-accent mb-12 text-sm">{description}</p>
        </div>
        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature.text} className="flex items-center space-x-3 ">
              {/* TODO fix icon from props */}
              {/* {feature.icon} */}
              <Icon.CheckIcon size={16} className="text-primary" />
              <span className="text-sm">{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <LoadingButton
        disabled={isDisabled}
        isLoading={isPending}
        variant={variant === "default" ? "default" : "secondary"}
        className="mt-6 w-full"
        onClick={handleBuyPlan}>
        {isCurrentPlan ? "Current Plan" : "Get started"}
      </LoadingButton>
    </div>
  );
}
