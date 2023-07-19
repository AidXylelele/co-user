import { Redis } from "ioredis";

export class MessageUtils {
  parse(message: string) {
    return JSON.parse(message);
  }

  stringify(input: any) {
    return JSON.stringify(input);
  }
}

export class RedisEvents extends MessageUtils {
  public sub: Redis;
  public pub: Redis;

  constructor(sub: Redis, pub: Redis) {
    super();
    this.sub = sub;
    this.pub = pub;
  }

  async subscribe(channel: string) {
    await this.sub.subscribe(channel);
  }

  async publish(channel: string, input: any) {
    const stringified = this.stringify(input);
    await this.pub.publish(channel, stringified);
  }
}

export class RedisDatabase extends MessageUtils {
  public pool: Redis;

  constructor(pool: Redis) {
    super();
    this.pool = pool;
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
