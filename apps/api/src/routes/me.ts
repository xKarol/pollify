import { apiUrls } from "@pollify/config";
import type { User } from "@pollify/types";
import { UserValidator } from "@pollify/validations";
import { Hono } from "hono";

import { requireAuth } from "../middlewares/require-auth";
import { zValidator } from "../middlewares/validator";
import { withAuth } from "../middlewares/with-auth";
import { withPagination } from "../middlewares/with-pagination";
import { withSorting } from "../middlewares/with-sorting";
import {
  deleteUser,
  getUserPolls,
  getUserVotes,
  updateUserData,
} from "../services/user";

const me = new Hono()
  .patch(
    apiUrls.users.update,
    withAuth,
    requireAuth,
    zValidator("json", UserValidator.updateUserSchema),
    async (c) => {
      const { session: user } = c.get("user");
      const payload = c.req.valid("json");

      const response = await updateUserData(user.id, payload);

      return c.json(response);
    }
  )
  .delete(apiUrls.users.delete, withAuth, requireAuth, async (c) => {
    const { session: user } = c.get("user");
    await deleteUser(user.id);

    return c.json({});
  })
  .get(
    apiUrls.users.getVotes,
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
  )
  .get(
    apiUrls.users.getPolls,
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
