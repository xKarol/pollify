import { cn } from "@pollify/lib";
import { Button } from "@pollify/ui";
import Link from "next/link";
import React from "react";

import { routes } from "../config/routes";

type Props = React.ComponentPropsWithoutRef<"section">;

export const CTA = ({ className, ...rest }: Props) => {
  return (
    <section
      className={cn("container flex flex-col items-center py-16", className)}
      {...rest}>
      <div className="mb-6">
        <h1 className="mb-4 text-center text-4xl font-medium !leading-[1.2] xl:text-5xl">
          Ready to Start?
          <br />
          Create Your Poll Now
        </h1>
        <p className="text-accent max-w-xl text-center xl:text-lg">
          Start gathering insights instantly—no account required. Get valuable
          feedback and make smarter decisions today!
        </p>
      </div>
      <Button
        variant="primary"
        asChild
        className="w-full rounded-full md:w-auto">
        <Link href={routes.CREATE_POLL}>Create poll</Link>
      </Button>
    </section>
  );
};
