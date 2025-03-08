import { cn } from "@pollify/lib";
import { Avatar, Button, Logo, ScrollArea, Skeleton } from "@pollify/ui";
import type { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMedia, useLockBodyScroll } from "react-use";

import { routes } from "../../config/routes";
import { ProfileMenu } from "./profile-menu";

const navLinks = [
  {
    text: "Create Poll",
    href: routes.CREATE_POLL,
  },
  {
    text: "Explore Polls",
    href: routes.EXPLORE_POLLS,
  },
  {
    text: "Features",
    href: routes.FEATURES,
  },
  {
    text: "Pricing",
    href: routes.PRICING,
  },
];

type HeaderContextValue = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  session: Session | null;
  status: "authenticated" | "loading" | "unauthenticated";
};

const HeaderContext = React.createContext<HeaderContextValue>(
  {} as HeaderContextValue
);

const useHeaderContext = () => {
  const headerContext = React.useContext(HeaderContext);
  if (!headerContext)
    throw new Error(
      "Invalid Header Context. Component need to be wrapped with HeaderRoot component."
    );
  return headerContext;
};

type HeaderProps = Omit<
  React.ComponentProps<typeof HeaderRoot>,
  "children" | "session" | "status"
>;

export default function Header({ className, ...rest }: HeaderProps) {
  const { data: session, status } = useSession();

  return (
    <HeaderRoot
      session={session}
      status={status}
      className={cn(className)}
      {...rest}>
      <HeaderLogo />
      <HeaderNavigation />
    </HeaderRoot>
  );
}

type HeaderRootProps = Pick<HeaderContextValue, "status" | "session"> &
  React.ComponentPropsWithoutRef<"header">;

export function HeaderRoot({
  session,
  status,
  className,
  children,
  ...rest
}: HeaderRootProps) {
  const [isOpen, setIsOpen] = useState(false);
  useLockBodyScroll(isOpen);

  return (
    <HeaderContext.Provider value={{ isOpen, status, setIsOpen, session }}>
      <header
        className={cn(
          "bg-background sticky left-0 right-0 top-0 z-50 h-[4.5rem]",
          className
        )}
        {...rest}>
        <div className="container flex size-full items-center justify-between">
          {children}
        </div>
      </header>
    </HeaderContext.Provider>
  );
}

type HeaderLogoProps = React.ComponentProps<typeof Logo>;

export function HeaderLogo({ className, ...rest }: HeaderLogoProps) {
  return <Logo variant="text" className={cn("z-50", className)} {...rest} />;
}

function HeaderLink({
  href,
  className,
  children,
}: React.ComponentProps<typeof Link>) {
  const router = useRouter();
  const isActive = href === router.asPath;
  return (
    <Link
      href={href}
      className={cn(
        "text-accent transition-colors hover:text-black hover:dark:text-white",
        isActive && "font-medium text-black dark:text-white",
        className
      )}>
      {children}
    </Link>
  );
}

export function HeaderNavigation() {
  const { isOpen, session, status } = useHeaderContext();
  return (
    <>
      {isOpen ? <MobileNavigationMenu /> : null}
      <nav className="hidden items-center space-x-8 xl:flex">
        <ul className="flex space-x-6 text-sm">
          {navLinks.map((link) => (
            <HeaderLink href={link.href} key={link.text}>
              {link.text}
            </HeaderLink>
          ))}
        </ul>

        {status === "loading" ? (
          <Skeleton className="h-8 w-20" />
        ) : session?.user ? (
          <ProfileMenu
            trigger={
              <Avatar
                src={session.user.image}
                className="size-10 cursor-pointer">
                {session.user?.name[0]}
              </Avatar>
            }
          />
        ) : (
          <Button variant="primary" asChild>
            <Link href={routes.LOGIN}>Login</Link>
          </Button>
        )}
      </nav>
      <HamburgerMenu className="z-50 xl:hidden" />
    </>
  );
}

type MobileNavigationMenuProps = React.ComponentPropsWithoutRef<"nav">;

function MobileNavigationMenu({
  className,
  ...rest
}: MobileNavigationMenuProps) {
  const { session, setIsOpen } = useHeaderContext();
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeComplete = () => setIsOpen(false);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router.events, setIsOpen]);

  return (
    <nav
      className={cn(
        "bg-background fixed bottom-0 left-0 right-0 top-0 z-40",
        className
      )}
      {...rest}>
      <div className="container">
        <ScrollArea className="h-screen pt-[7.5rem]">
          <div className="container flex flex-col items-center space-y-8">
            <ul className="flex w-full flex-col items-center space-y-8 text-xl font-semibold">
              {navLinks.map((link) => (
                <li key={link.text}>
                  <Link href={link.href}>{link.text}</Link>
                </li>
              ))}
              {session ? (
                <>
                  <li>
                    <Link href={routes.DASHBOARD.HOME}>Dashboard</Link>
                  </li>
                  <li className="cursor-pointer" onClick={() => signOut()}>
                    Logout
                  </li>
                </>
              ) : null}
            </ul>
            {session ? (
              <div className="flex items-center justify-center space-x-2">
                <Avatar src={session?.user?.image} className="size-8">
                  {session?.user.name[0]}
                </Avatar>
                <span>{session?.user.name}</span>
              </div>
            ) : (
              <Button asChild variant="primary" className="w-32">
                <Link href={routes.LOGIN}>Login</Link>
              </Button>
            )}
          </div>
        </ScrollArea>
      </div>
    </nav>
  );
}

type HamburgerMenuProps = React.ComponentPropsWithoutRef<"button">;

function HamburgerMenu({ className, ...rest }: HamburgerMenuProps) {
  const { setIsOpen, isOpen } = useHeaderContext();
  const isDesktop = useMedia("(min-width: 1280px)", true);

  useEffect(() => {
    setIsOpen(false);
  }, [isDesktop, setIsOpen]);

  return (
    <button
      type="button"
      onClick={() => setIsOpen((current) => !current)}
      className={cn("relative flex h-3 w-[1.75rem] cursor-pointer", className)}
      {...rest}>
      <div
        className={cn(
          "absolute top-0 h-0.5 w-full rounded bg-black transition-transform dark:bg-white",
          isOpen && "top-1/2 w-full -translate-y-1/2 -rotate-45"
        )}></div>

      <div
        className={cn(
          "absolute bottom-0 h-0.5 w-full rounded bg-black transition-transform dark:bg-white",
          isOpen && "top-1/2 w-full -translate-y-1/2 rotate-45"
        )}></div>
    </button>
  );
}
