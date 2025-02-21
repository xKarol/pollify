import { cn } from "@pollify/lib";
import {
  Icon,
  Logo,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@pollify/ui";
import { useTheme } from "next-themes";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { routes } from "../config/routes";

type FooterProps = React.ComponentPropsWithoutRef<"footer">;

const navLinks = [
  {
    heading: "Product",
    links: [
      { name: "Pricing", href: routes.PRICING },
      { name: "FAQ", href: routes.FAQ },
      { name: "Help Center", href: routes.HELP },
    ],
  },
  {
    heading: "Actions",
    links: [
      { name: "Create Poll", href: routes.CREATE_POLL },
      { name: "Public Polls", href: routes.PUBLIC_POLLS },
    ],
  },
  {
    heading: "Company",
    links: [
      { name: "Contact", href: routes.CONTACT },
      { name: "About Us", href: routes.ABOUT_US },
    ],
  },
  {
    heading: "Legal",
    links: [
      { name: "Privacy Policy", href: routes.HOME },
      { name: "Terms & Conditions", href: routes.HOME },
    ],
  },
];

const Footer = ({ className, ...props }: FooterProps) => {
  return (
    <footer className={cn("container pb-8 pt-16", className)} {...props}>
      <div className="flex flex-col md:flex-row md:justify-between md:space-x-16">
        <div className="mb-8 flex flex-wrap items-center gap-4 md:mb-0 md:flex-col md:flex-nowrap md:items-start">
          <Logo className="shrink-0" />
          <p className="max-w-[240px] text-sm text-neutral-600 dark:text-neutral-300">
            Discover, Share, and Engage with Quick Poll – Your Polling Partner!
          </p>
        </div>
        <nav className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4 md:mb-0">
          {navLinks.map((linksGroup) => (
            <div
              className="flex flex-col space-y-4 md:space-y-4"
              key={linksGroup.heading}>
              <p className="text-sm font-medium">{linksGroup.heading}</p>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
                {linksGroup.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-neutral-900 hover:dark:text-white">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="mb-8 flex flex-wrap md:mt-8">
        <div className="flex items-center space-x-4">
          <ul className="flex space-x-4 text-neutral-600 dark:text-neutral-300">
            <li className="transition-colors hover:text-black hover:dark:text-white">
              <Link href={"https://x.com"}>
                <Icon.XTwitter className="h-5 w-5" />
              </Link>
            </li>
            <li className="transition-colors hover:text-black hover:dark:text-white">
              <Link href={"https://instagram.com"}>
                <Icon.Instagram className="h-5 w-5" />
              </Link>
            </li>
            <li className="transition-colors hover:text-black hover:dark:text-white">
              <Link href={"https://facebook.com"}>
                <Icon.Facebook className="h-5 w-5" />
              </Link>
            </li>
          </ul>
          <ThemeSelect />
        </div>
        <LanguageSelect />
      </div>
      <div className="flex justify-center">
        <span className="text-xs text-neutral-600 dark:text-neutral-300">
          © {new Date().getFullYear()} Quick Poll. All rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;

function ThemeSelect({
  className,
  ...props
}: React.ComponentProps<typeof Select> & { className?: string }) {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Select defaultValue={theme} onValueChange={setTheme} {...props}>
      <SelectTrigger
        className={cn(
          "w-[100px] border-none !bg-transparent text-xs [&>svg]:hidden",
          className
        )}>
        <div className="flex items-center space-x-2">
          {resolvedTheme === "dark" ? (
            <Icon.Moon className="h-4 w-4" />
          ) : (
            <Icon.Sun className="h-4 w-4" />
          )}
          <SelectValue defaultValue="system" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem className="text-xs" value="system">
          System
        </SelectItem>
        <SelectItem className="text-xs" value="dark">
          Dark
        </SelectItem>
        <SelectItem className="text-xs" value="light">
          Light
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

function LanguageSelect({
  className,
  ...props
}: React.ComponentProps<typeof Select> & { className?: string }) {
  return (
    <Select defaultValue="english" {...props}>
      <SelectTrigger
        className={cn(
          "w-[100px] border-none !bg-transparent text-xs [&>svg]:hidden",
          className
        )}>
        <div className="flex items-center space-x-2">
          <Icon.Globe className="h-4 w-4" />
          <SelectValue
            defaultValue="english"
            placeholder="Select language..."
          />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="english">English</SelectItem>
      </SelectContent>
    </Select>
  );
}
