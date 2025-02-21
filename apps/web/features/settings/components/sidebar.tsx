import { Icon } from "@pollify/ui";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import {
  Sidebar,
  SidebarNavigationLink,
  SidebarNavigationList,
} from "../../../components/sidebar";
import { routes } from "../../../config/routes";

type Props = React.ComponentProps<typeof Sidebar>;

type SidebarLinks = {
  category: string;
  tabs: { text: string; href: string; IconElement: JSX.Element }[];
}[];

export const sidebarLinks: SidebarLinks = [
  {
    category: "Account",
    tabs: [
      {
        text: "General",
        href: routes.SETTINGS.ACCOUNT.GENERAL,
        IconElement: <Icon.Hexagon />,
      },
      {
        text: "Edit profile",
        href: routes.SETTINGS.ACCOUNT.EDIT,
        IconElement: <Icon.User2 />,
      },
    ],
  },
  {
    category: "Preferences",
    tabs: [
      {
        text: "Appearance",
        href: routes.SETTINGS.PREFERENCES.APPEARANCE,
        IconElement: <Icon.Palette />,
      },
    ],
  },
  {
    category: "Billing",
    tabs: [
      {
        text: "My plan",
        href: routes.SETTINGS.BILLING.MY_PLAN,
        IconElement: <Icon.CreditCard />,
      },
    ],
  },
];

export default function SidebarContainer({ className, ...props }: Props) {
  const router = useRouter();

  return (
    <Sidebar className={className} {...props}>
      <SidebarNavigationLink
        as={Link}
        href={routes.DASHBOARD.HOME}
        className="mb-2"
        IconElement={<Icon.ArrowLeft />}>
        Back
      </SidebarNavigationLink>

      <div className="flex flex-1 flex-col justify-between">
        <nav className="space-y-4">
          {sidebarLinks.map(({ category, tabs }) => (
            <div key={category}>
              {category ? (
                <span className="px-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {category}
                </span>
              ) : null}
              <SidebarNavigationList as="div">
                {tabs.map((link) => (
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
            </div>
          ))}
        </nav>
        <SidebarNavigationList as="div">
          <SidebarNavigationLink IconElement={<Icon.HelpCircle />}>
            Support Center
          </SidebarNavigationLink>
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
