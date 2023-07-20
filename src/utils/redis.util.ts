import { Redis } from "ioredis";
import { ParseUtil } from "./parse.util";

export class RedisUtil extends ParseUtil {
  public sub: Redis;
  public pub: Redis;
  public pool: Redis;

  constructor(sub: Redis, pub: Redis, pool: Redis) {
    super();
    this.sub = sub;
    this.pub = pub;
    this.pool = pool;
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
