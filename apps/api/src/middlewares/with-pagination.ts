import { createMiddleware } from "hono/factory";
import { z } from "zod";

const paginationParams = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).optional().default(10),
});

export const withPagination = createMiddleware<{
  Variables: {
    pagination: z.infer<typeof paginationParams> & { skip: number };
  };
}>(async (c, next) => {
  const { page, limit } = paginationParams.parse(c.req.query());
  const skip = (page - 1) * limit;

  c.set("pagination", {
    page,
    limit,
    skip,
  });

  return next();
});
