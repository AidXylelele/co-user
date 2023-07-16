import { Channels } from "src/types/redis.types";

export const channels: Channels = {
  login: "user:login",
  register: "user:register",
  error: "user:error",
};
