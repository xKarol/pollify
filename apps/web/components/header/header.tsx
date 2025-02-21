import { cn } from "@pollify/lib";
import {
  Avatar,
  Button,
  Icon,
  Logo,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ScrollArea,
} from "@pollify/ui";
import type { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMedia, useLockBodyScroll } from "react-use";

import { routes } from "../../config/routes";

const navLinks = [
  {
    text: "Create Poll",
    href: routes.CREATE_POLL,
  },
  {
    text: "Public Polls",
    href: routes.PUBLIC_POLLS,
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
  session: Session;
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
  "children" | "session"
>;

export default function Header({ className, ...rest }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <HeaderRoot session={session} className={cn(className)} {...rest}>
      <HeaderLogo />
      <HeaderNavigation />
    </HeaderRoot>
  );
}

type HeaderRootProps = {
  session: Session;
} & React.ComponentPropsWithoutRef<"header">;

export function HeaderRoot({
  session,
  className,
  children,
  ...rest
}: HeaderRootProps) {
  const [isOpen, setIsOpen] = useState(false);
  useLockBodyScroll(isOpen);

  return (
    <HeaderContext.Provider value={{ isOpen, setIsOpen, session }}>
      <header
        className={cn(
          "container z-50 flex items-center justify-between py-4",
          className
        )}
        {...rest}>
        {children}
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
        "text-neutral-400",
        isActive && "font-semibold text-white",
        className
      )}>
      {children}
    </Link>
  );
}

export function HeaderNavigation() {
  const { isOpen, session } = useHeaderContext();
  return (
    <>
      {isOpen ? <MobileNavigationMenu /> : null}
      <nav className="hidden items-center space-x-12 xl:flex">
        <ul className="flex space-x-12 text-sm">
          {navLinks.map((link) => (
            <HeaderLink href={link.href} key={link.text}>
              {link.text}
            </HeaderLink>
          ))}
        </ul>

        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex cursor-pointer items-center justify-center space-x-2">
                <Avatar src={session.user.image} className="h-6 w-6">
                  {session.user.name[0]}
                </Avatar>
                <div className="flex items-center space-x-1">
                  <span className="text-sm">{session.user.name}</span>
                  <Icon.ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={routes.DASHBOARD.HOME}>
                  <Icon.Home className="mr-2 h-4 w-4" />
                  <span className="text-xs">Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={routes.DASHBOARD.POLLS}>
                  <Icon.BarChart2 className="mr-2 h-4 w-4" />
                  <span className="text-xs">Your polls</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={routes.SETTINGS.HOME}>
                  <Icon.Settings className="mr-2 h-4 w-4" />
                  <span className="text-xs">Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: routes.LOGIN })}>
                <Icon.LogOut className="mr-2 h-4 w-4" />
                <span className="text-xs">Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            asChild
            variant="secondary"
            className="w-28 rounded-full !bg-green-500 hover:!bg-green-500/80">
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
        "fixed bottom-0 left-0 right-0 top-0 z-40 bg-neutral-50 dark:bg-neutral-900",
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
                <Avatar src={session?.user?.image} className="h-8 w-8">
                  {session?.user.name[0]}
                </Avatar>
                <span>{session?.user.name}</span>
              </div>
            ) : (
              <Button
                asChild
                variant="secondary"
                className="w-32 rounded-full !bg-green-500">
                <Link href={routes.LOGIN}>Login</Link>
              </Button>
            )}
          </div>
        </ScrollArea>
      </div>
    </nav>
  );
}

type HamburgerMenuProps = React.ComponentPropsWithoutRef<"div">;

function HamburgerMenu({ className, ...rest }: HamburgerMenuProps) {
  const { setIsOpen, isOpen } = useHeaderContext();
  const isDesktop = useMedia("(min-width: 1280px)", true);

  useEffect(() => {
    setIsOpen(false);
  }, [isDesktop, setIsOpen]);

  return (
    <div
      onClick={() => setIsOpen((current) => !current)}
      className={cn(
        "relative flex h-[20px] w-[30px] cursor-pointer flex-col items-end gap-1.5",
        className
      )}
      {...rest}>
      <div
        className={cn(
          "absolute top-0 h-0.5 w-6 rounded bg-neutral-900 transition-all dark:bg-neutral-50",
          isOpen && "top-1/2 w-full -translate-y-1/2 -rotate-45"
        )}></div>
      <div
        className={cn(
          "absolute top-1/2 h-0.5 w-full -translate-y-1/2 rounded bg-neutral-900 transition-all dark:bg-neutral-50",
          isOpen && "top-1/2 w-full -translate-y-1/2 rotate-45"
        )}></div>
      <div
        className={cn(
          "absolute bottom-0 h-0.5 w-5 rounded bg-neutral-900 transition-all dark:bg-neutral-50",
          isOpen && "top-1/2 w-full -translate-y-1/2 -rotate-45 opacity-0"
        )}></div>
    </div>
  );
}
