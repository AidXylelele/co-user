import { RedisCollection } from "src/types/redis.types";

export const authTemplates: RedisCollection = {
  auth: {
    register: ":register",
    login: ":login",
    error: ":error",
  },
};
