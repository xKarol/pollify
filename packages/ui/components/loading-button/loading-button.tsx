import { cn } from "@pollify/lib";
import { Loader2 } from "lucide-react";
import React from "react";

import { Button } from "../button";

export type LoadingButtonProps = { isLoading: boolean } & React.ComponentProps<
  typeof Button
>;

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ isLoading, className, children, ...props }, ref) => {
    return (
      <Button
        className={cn(className)}
        ref={ref}
        {...props}
        disabled={isLoading || props.disabled}>
        {isLoading && <Loader2 size={16} className="mr-2 animate-spin" />}
        {children}
      </Button>
    );
  }
);
LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
