import React from "react";

import Heading from "./heading";

type HeaderProps = {
  heading: string;
  description?: string;
  ActionComponent?: React.ReactNode;
} & React.ComponentPropsWithoutRef<"div">;

export default function Header({
  ActionComponent,
  heading,
  description,
  ...props
}: HeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between" {...props}>
      <div className="mb-5 flex flex-col">
        <Heading>{heading}</Heading>
        {description ? (
          <p className="text-sm font-medium text-neutral-600">{description}</p>
        ) : null}
      </div>
      <div className="flex space-x-2">{ActionComponent}</div>
    </div>
  );
}
