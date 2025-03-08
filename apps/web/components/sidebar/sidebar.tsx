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
        "bg-foreground sticky left-0 top-0 z-50 flex h-[100dvh] min-w-64 flex-col px-3 py-6",
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
        "hover:bg-border flex cursor-pointer items-center space-x-2 rounded-xl p-2 text-sm font-medium transition-colors [&_svg]:size-4",
        isActive && "bg-border",
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
    <Component className={cn("space-y-0.5", className)} {...props}>
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
        "flex items-center space-x-2 p-2 text-sm font-medium",
        className
      )}
      {...props}>
      <Avatar className="size-5" src={avatarUrl} alt={`${username}'s profile`}>
        {username[0]}
      </Avatar>
      <div className="flex items-center space-x-2">
        <span>{username}</span>
      </div>
    </div>
  );
}
