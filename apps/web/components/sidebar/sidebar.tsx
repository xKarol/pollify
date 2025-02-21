import { cn } from "@pollify/lib";
import { Avatar } from "@pollify/ui";
import React from "react";

export type SidebarProps = React.ComponentPropsWithoutRef<"aside">;

export default function Sidebar({
  className,
  children,
  ...props
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "dark:bg-dark sticky left-0 top-0 flex h-[100dvh] min-w-[220px] flex-col border-r border-neutral-200/50 bg-neutral-100 px-2 py-4 dark:border-neutral-800/50",
        className
      )}
      {...props}>
      {children}
    </aside>
  );
}

export type SidebarNavigationLinkProps<T extends React.ElementType> = {
  as?: T;
  children?: React.ReactNode;
  isActive?: boolean;
  IconElement: JSX.Element;
};

export function SidebarNavigationLink<T extends React.ElementType = "div">({
  isActive,
  IconElement,
  className,
  children,
  as,
  ...props
}: SidebarNavigationLinkProps<T> &
  Omit<
    React.ComponentPropsWithoutRef<T>,
    keyof SidebarNavigationLinkProps<T>
  >) {
  const Component = as || "div";
  return (
    <Component
      className={cn(
        "flex cursor-pointer items-center space-x-2 rounded p-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-200 hover:text-black dark:text-neutral-200 hover:dark:bg-neutral-800 hover:dark:text-white [&_svg]:h-4 [&_svg]:w-4",
        isActive && "bg-neutral-200 dark:bg-neutral-800",
        className
      )}
      {...props}>
      {IconElement}
      <span>{children}</span>
    </Component>
  );
}

export type SidebarNavigationListProps<T extends React.ElementType> = {
  as?: T;
  children?: React.ReactNode;
};

export function SidebarNavigationList<T extends React.ElementType = "nav">({
  className,
  children,
  as,
  ...props
}: SidebarNavigationListProps<T> &
  Omit<
    React.ComponentPropsWithoutRef<T>,
    keyof SidebarNavigationLinkProps<T>
  >) {
  const Component = as || "nav";
  return (
    <Component className={cn("space-y-[0.125rem]", className)} {...props}>
      {children}
    </Component>
  );
}

export type SidebarProfileProps = {
  avatarUrl?: string;
  username: string;
} & React.ComponentPropsWithoutRef<"div">;

export function SidebarProfile({
  avatarUrl,
  username,
  className,
  ...props
}: SidebarProfileProps) {
  return (
    <div
      className={cn(
        "flex cursor-pointer items-center space-x-2 rounded p-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-200 hover:text-black dark:text-neutral-200 hover:dark:bg-neutral-800 hover:dark:text-white",
        className
      )}
      {...props}>
      <Avatar className="h-5 w-5" src={avatarUrl} alt={`${username}'s profile`}>
        {username[0]}
      </Avatar>
      <div className="flex items-center space-x-2">
        <span>{username}</span>
      </div>
    </div>
  );
}
