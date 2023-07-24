import { Collection } from "./common.types";

export type RedisCollection = {
  [key: string]: Collection<string>;
};

export type RedisChannels = {
  requests: RedisCollection;
  responses: RedisCollection;
};
