import type { HonoRequest } from "hono";
import { getClientIp } from "request-ip";

export const getIP = (req: HonoRequest) => {
  const ip = getClientIp({ headers: req.header() }) || undefined;
  return ip;
};
