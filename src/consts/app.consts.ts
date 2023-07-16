import { Channels } from "src/types/redis.types";

export const channels: Channels = {
  login: "auth:login",
  register: "auth:register",
  error: "auth:error",
};
