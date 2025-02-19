import { Tinybird } from "@chronark/zod-bird";

const tinybird = new Tinybird({ token: process.env.TINYBIRD_TOKEN! });

export default tinybird;
