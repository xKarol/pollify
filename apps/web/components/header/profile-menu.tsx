import { cn } from "@pollify/lib";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icon,
} from "@pollify/ui";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

import { routes } from "../../config/routes";

type Props = { trigger: React.ReactNode };

const navItems = [
  {
    text: "Dashboard",
    href: routes.DASHBOARD.HOME,
    Icon: <Icon.LayoutDashboard />,
  },
  {
    text: "My polls",
    href: routes.DASHBOARD.POLLS,
    Icon: <Icon.BarChart3 />,
  },
  {
    text: "My votes",
    href: routes.DASHBOARD.VOTES,
    Icon: <Icon.Vote />,
  },
  {
    text: "Pricing",
    href: routes.PRICING,
    Icon: <Icon.DollarSign />,
  },
  {
    text: "Settings",
    href: routes.SETTINGS.HOME,
    Icon: <Icon.Settings />,
  },
];

export const ProfileMenu = ({ trigger }: Props) => {
  const { data: session } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 p-0" align="end">
        <div className="p-1">
          <div className="flex items-center justify-between p-3">
            <div className="flex flex-col">
              <span className="text-sm font-medium">{session?.user.name}</span>
              <span className="text-accent text-xs">{session?.user.email}</span>
            </div>
          </div>
          <DropdownMenuSeparator />
          {navItems.map((navItem) => (
            <ProfileMenuItem
              key={navItem.text}
              Icon={navItem.Icon}
              href={navItem.href}>
              {navItem.text}
            </ProfileMenuItem>
          ))}
          <ProfileMenuItem Icon={<Icon.LogOut />} onClick={() => signOut()}>
            Log out
          </ProfileMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function ProfileMenuItem({
  Icon,
  href,
  className,
  children,
  ...rest
}: (
  | React.ComponentProps<typeof Link>
  | React.ComponentPropsWithoutRef<"div">
) & {
  href?: string;
  Icon: React.ReactNode;
}) {
  const Comp = href === undefined ? "div" : Link;
  return (
    <DropdownMenuItem asChild>
      {/* @ts-ignore */}
      <Comp {...(href && { href })} className={cn("", className)} {...rest}>
        {Icon}
        <span>{children}</span>
      </Comp>
    </DropdownMenuItem>
  );
}
