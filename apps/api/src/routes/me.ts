import { zValidator } from "@hono/zod-validator";
import { apiUrls } from "@poll/config";
import type { User } from "@poll/types";
import { UserValidator } from "@poll/validators";
import { Hono } from "hono";

import type { App } from "..";
import { requireAuth } from "../middlewares/require-auth";
import { withAuth } from "../middlewares/with-auth";
import { withPagination } from "../middlewares/with-pagination";
import { withSorting } from "../middlewares/with-sorting";
import {
  deleteUser,
  getUserPolls,
  getUserVotes,
  updateUserData,
} from "../services/user";

const me: App = new Hono();

// me.get(apiUrls.user.getCurrentUser, (c) =>
//   c.json("apiUrls.user.getCurrentUser")
// );

me.patch(
  apiUrls.user.update,
  withAuth,
  requireAuth,
  zValidator("json", UserValidator.updateUserSchema),
  async (c) => {
    const { session: user } = c.get("user");
    const payload = c.req.valid("json");

    const response = await updateUserData(user.id, payload);

    return c.json(response);
  }
);

me.delete(apiUrls.user.delete, withAuth, requireAuth, async (c) => {
  const { session: user } = c.get("user");
  await deleteUser(user.id);

  return c.status(200);
});

me.get(
  apiUrls.user.getVotes,
  withAuth,
  requireAuth,
  withPagination,
  withSorting<User.SortVotesFields>({
    allowedFields: ["createdAt"],
    defaultField: "createdAt",
  }),
  async (c) => {
    const { session: user } = c.get("user");
    const { sortBy, orderBy } = c.get("sorting");
    const pagination = c.get("pagination");

    const votes = await getUserVotes({
      userId: user.id,
      ...pagination,
      sortBy,
      orderBy,
    });

    return c.json(votes);
  }
);

me.get(
  apiUrls.user.getPolls,
  withAuth,
  requireAuth,
  withPagination,
  withSorting<User.SortPollsFields>({
    allowedFields: ["createdAt", "totalVotes", "isPublic"],
    defaultField: "createdAt",
  }),
  async (c) => {
    const { session: user } = c.get("user");
    const { sortBy, orderBy } = c.get("sorting");
    const pagination = c.get("pagination");

    const response = await getUserPolls({
      userId: user.id,
      sortBy,
      orderBy,
      ...pagination,
    });

    return c.json(response);
  }
);

export default me;
