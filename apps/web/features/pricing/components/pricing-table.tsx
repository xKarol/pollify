import { cn } from "@pollify/lib";
import {
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@pollify/ui";
import React from "react";

export type PricingTableProps = React.ComponentProps<typeof Table> & {
  features: [string, boolean, boolean, boolean][];
  planNames: [string, string, string];
};

export const PricingTable = ({
  planNames,
  features,
  className,
  ...rest
}: PricingTableProps) => {
  return (
    <Table className={cn("mt-16 min-w-max", className)} {...rest}>
      <TableHeader>
        <TableRow>
          <TableHead>Feature</TableHead>
          {planNames.map((planName) => (
            <TableHead key={planName} className="text-center">
              {planName}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {features.map(([description, ...isAvailable]) => (
          <TableRow key={description}>
            <TableCell
              className="max-w-xs truncate capitalize"
              title={description}>
              {description}
            </TableCell>
            {isAvailable.map((planAvailable, index) => (
              <TableCell key={description + index}>
                {planAvailable ? (
                  <Icon.Check className="mx-auto text-green-500" />
                ) : (
                  <Icon.X className="mx-auto text-neutral-500" />
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
