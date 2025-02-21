import { handle as _handle } from "hono/vercel";

import app from ".";

export const handle = () => _handle(app);
