import { Avatar } from "@mui/material";
import { cn } from "@poll/lib";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

import { routes } from "../config/routes";

type HeaderProps = React.ComponentPropsWithoutRef<"header">;

const Header = ({ className, ...rest }: HeaderProps) => {
  const { data: session } = useSession();

  return (
    <header
      className={cn(
        "container py-6 flex justify-between items-center",
        className
      )}
      {...rest}>
      <Link href={routes.HOME}>Poll</Link>
      <HamburgerMenu />
      {session ? (
        <div className="flex justify-center space-x-2 items-center">
          <Avatar
            src={session.user.image}
            sx={{ width: "32px", height: "32px" }}>
            {session.user.name[0]}
          </Avatar>
          <span>{session.user.name}</span>
        </div>
      ) : null}
    </header>
  );
};

export default Header;

type HamburgerMenuProps = React.ComponentPropsWithoutRef<"div">;

function HamburgerMenu({ className, ...rest }: HamburgerMenuProps) {
  return (
    <div
      className={cn("flex flex-col items-end w-[30px] gap-1.5", className)}
      {...rest}>
      <div className="w-6 h-0.5 bg-neutral-950 rounded-[0.25rem]"></div>
      <div className="w-full h-0.5 bg-neutral-950 rounded-[0.25rem]"></div>
      <div className="w-5 h-0.5 bg-neutral-950 rounded-[0.25rem]"></div>
    </div>
  );
}
