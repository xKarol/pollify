import { cn } from "@pollify/lib";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const inputVariants = cva(
  "flex w-full rounded-xl border px-4 py-3 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-accent disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-border bg-foreground ",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  LeftIcon?: React.ReactNode;
  RightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant, LeftIcon, RightIcon, className, type, ...props }, ref) => {
    return (
      <div className="relative flex items-center [&>svg:first-child]:absolute [&>svg:first-child]:left-2 [&>svg:first-child]:top-1/2 [&>svg:first-child]:-translate-y-1/2 [&>svg:last-child]:absolute [&>svg:last-child]:right-2 [&>svg:last-child]:top-1/2 [&>svg:last-child]:-translate-y-1/2 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:cursor-pointer">
        {LeftIcon}
        <input
          type={type}
          className={cn(inputVariants({ variant, className }))}
          ref={ref}
          {...props}
        />
        {RightIcon}
      </div>
    );
  }
);
Input.displayName = "Input";
