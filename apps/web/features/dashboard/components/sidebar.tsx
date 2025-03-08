import { cn } from "@pollify/lib";
import { Icon, Logo, Skeleton } from "@pollify/ui";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import {
  Sidebar,
  SidebarNavigationLink,
  SidebarProfile,
  SidebarNavigationList,
} from "../../../components/sidebar";
import { routes } from "../../../config/routes";

type Props = React.ComponentProps<typeof Sidebar>;

export const sidebarLinks = [
  {
    text: "Analytics",
    href: routes.DASHBOARD.ANALYTICS.HOME,
    IconElement: <Icon.BarChart2 />,
  },
  {
    text: "My polls",
    href: routes.DASHBOARD.POLLS,
    IconElement: <Icon.PieChart />,
  },
  {
    text: "My votes",
    href: routes.DASHBOARD.VOTES,
    IconElement: <Icon.Vote />,
  },

  {
    text: "Settings",
    href: routes.SETTINGS.ACCOUNT.GENERAL,
    IconElement: <Icon.Settings />,
  },
];

export default function SidebarContainer({ className, ...props }: Props) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  return (
    <Sidebar className={cn("z-50", className)} {...props}>
      <Logo variant="text" className="mb-6" />
      <div className="flex flex-1 flex-col justify-between">
        <SidebarNavigationList>
          {sidebarLinks.map((link) => (
            <SidebarNavigationLink
              key={link.text}
              as={Link}
              href={link.href}
              IconElement={link.IconElement}
              isActive={router.asPath === link.href}>
              {link.text}
            </SidebarNavigationLink>
          ))}
        </SidebarNavigationList>

        <SidebarNavigationList as="div">
          {isLoggedIn ? (
            <SidebarProfile
              username={session.user.name}
              avatarUrl={session.user.image}
            />
          ) : (
            <Skeleton className="bg-border h-9 w-full" />
          )}
          <SidebarNavigationLink
            IconElement={<Icon.LogOut />}
            onClick={() => signOut({ callbackUrl: routes.LOGIN })}>
            Log Out
          </SidebarNavigationLink>
        </SidebarNavigationList>
      </div>
    </Sidebar>
  );
}
