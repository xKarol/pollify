import React from "react";

import Heading from "./heading";

type HeaderProps = {
  heading: string;
  description?: string;
  ActionComponent?: React.ReactNode;
} & React.ComponentPropsWithoutRef<"header">;

export default function Header({
  ActionComponent,
  heading,
  description,
  ...props
}: HeaderProps) {
  return (
    <header
      className="bg-background sticky right-0 top-[3.625rem] z-50 flex items-center justify-between py-4 pt-6 md:top-0"
      {...props}>
      <div className="mb-5 flex flex-col">
        <Heading>{heading}</Heading>
        {description ? (
          <p className="text-accent text-sm font-medium">{description}</p>
        ) : null}
      </div>
      <div className="flex space-x-2">{ActionComponent}</div>
    </header>
  );
}
