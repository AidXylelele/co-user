import { Collection } from "./common.types";

export type RedisChannels = {
  requests: Collection<string>;
  responses: Collection<string>;
};
