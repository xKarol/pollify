import type { OrderBy } from "@pollify/types";
import { createMiddleware } from "hono/factory";
import { z } from "zod";

const sortingParams = z.object({
  orderBy: z.enum(["asc", "desc"]).default("desc").optional(),
});

type withSortingParams<T> = {
  allowedFields: readonly [T, ...T[]];
  defaultField: NonNullable<T>;
  defaultOrder?: OrderBy;
};

export const withSorting = <T extends string>({
  allowedFields,
  defaultField,
  defaultOrder = "desc",
}: withSortingParams<T>) =>
  createMiddleware<{
    Variables: {
      sorting: z.infer<typeof sortingParams> & { sortBy: T };
    };
  }>(async (c, next) => {
    const { sortBy, orderBy } = sortingParams
      .extend({
        sortBy: z.enum(allowedFields).optional(),
      })
      .parse(c.req.query());
    c.set("sorting", {
      sortBy: sortBy || defaultField,
      orderBy: orderBy || defaultOrder,
    });

    return next();
  });
