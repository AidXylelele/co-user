import { RedisChannels } from "src/types/redis.types";

export const redisChannels: RedisChannels = {
  requests: {
    login: "user:req:login",
    register: "user:req:register",
  },
  responses: {
    login: "user:res:login",
    error: "user:res:error",
  },
};
