import { cn } from "@pollify/lib";
import { cva, type VariantProps } from "class-variance-authority";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  InfoIcon,
  XCircleIcon,
} from "lucide-react";
import * as React from "react";

const alertVariants = cva(
  "relative w-full rounded p-4 text-neutral-900 dark:text-white [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-3 [&>svg~*]:pl-8",
  {
    variants: {
      variant: {
        error: "bg-red-300 dark:bg-red-500",
        warning: "bg-orange-300 dark:bg-orange-500",
        info: "dark:bg-dark border border-neutral-100 bg-white dark:border-neutral-800",
        success: "bg-green-300 dark:bg-green-500",
      },
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant = "info", children, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}>
    {variant === "error" && <XCircleIcon />}
    {variant === "warning" && <AlertCircleIcon />}
    {variant === "info" && <InfoIcon />}
    {variant === "success" && <CheckCircle2Icon />}
    {children}
  </div>
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
