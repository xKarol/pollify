import { cn } from "@pollify/lib";

export type ShareSocialProps<T extends React.ElementType> = {
  as?: T;
};

export function ShareSocial<T extends React.ElementType = "button">({
  className,
  children,
  as,
  ...props
}: ShareSocialProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof ShareSocialProps<T>>) {
  const Component = as || "button";
  return (
    <Component
      className={cn(
        "!text-neutral-600 transition-colors hover:!text-black dark:!text-neutral-500 hover:dark:!text-neutral-300 [&_svg]:h-5 [&_svg]:w-5",
        className
      )}
      {...props}>
      {children}
    </Component>
  );
}
