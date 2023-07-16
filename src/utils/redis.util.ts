import { channels } from "src/consts/app.consts";
import { Channels } from "src/types/redis.types";

export class RedisUtil {
  public channels: Channels;
  constructor() {
    this.channels = channels;
  }
  parse(message: string) {
    return JSON.parse(message);
  }
  stringify(data: any) {
    return JSON.stringify(data);
  }
}
