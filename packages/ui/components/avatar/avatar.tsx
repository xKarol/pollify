import { cn } from "@pollify/lib";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import Image from "next/image";
import * as React from "react";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarRoot>,
  React.ComponentPropsWithoutRef<typeof AvatarRoot> & {
    src?: string;
    alt?: string;
  }
>(({ src, alt, className, children, ...props }, ref) => (
  <AvatarRoot ref={ref} className={className} {...props}>
    <AvatarImage src={src} alt={alt} />
    <AvatarFallback className="relative">
      {children ? (
        children
      ) : (
        <Image
          src="/default-avatar.svg"
          alt="avatar"
          className="size-full"
          fill
        />
      )}
    </AvatarFallback>
  </AvatarRoot>
));
Avatar.displayName = "Avatar";

const AvatarRoot = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex size-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square size-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex size-full items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
