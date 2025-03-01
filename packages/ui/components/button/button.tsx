import { cn } from "@pollify/lib";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const buttonVariants = cva(
  "inline-flex rounded-full text-sm items-center justify-center space-x-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-900 text-white hover:bg-neutral-900/90 dark:bg-white dark:text-neutral-900 hover:dark:bg-white/50",
        primary: "bg-primary hover:opacity-80 transition-opacity text-black",
        text: "hover:bg-neutral-900/5 hover:dark:bg-white/5",
        destructive:
          "bg-red-500 text-neutral-900 hover:bg-red-500/90 dark:bg-red-700 hover:dark:bg-red-700/90",
        outline: "bg-foreground border border-border",
        secondary:
          "bg-foreground text-black dark:text-white hover:bg-foreground/50",
        // ghost: "hover:bg-accent hover:text-accent-foreground",
        // link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-3",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
