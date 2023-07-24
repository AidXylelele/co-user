import { Redis } from "ioredis";
import { ParseUtil } from "./parse.util";
import { RedisChannels, RedisCollection } from "src/types/redis.types";
import { Collection } from "src/types/common.types";

export class RedisUtil extends ParseUtil {
  public sub: Redis;
  public pub: Redis;
  public pool: Redis;
  public channels: RedisChannels;

  constructor(sub: Redis, pub: Redis, pool: Redis, templates: RedisCollection) {
    super();
    this.sub = sub;
    this.pub = pub;
    this.pool = pool;
    this._init(templates);
  }

  private async _init(templates: RedisCollection) {
    const subscriptions = [];
    this.setChannels(templates);
    const allChannelTypes = Object.values(this.channels);
    for (const channelType of allChannelTypes) {
      for (const channels in channelType) {
        const values = Object.values(channelType[channels]);
        for (const value of values) {
          const subscription = this.subscribe(value);
          subscriptions.push(subscription);
        }
      }
    }
    await Promise.all(subscriptions);
  }

  generateChannels(pattern: string, templates: RedisCollection) {
    const result: RedisCollection = {};
    const entries = Object.entries(templates);
    for (const [key, value] of entries) {
      const filled: Collection<string> = {};
      for (const item in value) {
        const template = value[item];
        filled[item] = pattern + template;
      }
      result[key] = filled;
    }
    return result;
  }

  setChannels(templates: RedisCollection) {
    const requests = this.generateChannels("req", templates);
    const responses = this.generateChannels("res", templates);
    this.channels = { requests, responses };
  }

  async subscribe(channel: string) {
    await this.sub.subscribe(channel);
  }

  async publish(channel: string, input: any) {
    const stringified = this.stringify(input);
    await this.pub.publish(channel, stringified);
  }

  async get(email: string) {
    const data = await this.pool.get(email);
    return this.parse(data);
  }

  async set(email: string, input: any) {
    const stringified = this.stringify(input);
    await this.set(email, stringified);
  }
}
