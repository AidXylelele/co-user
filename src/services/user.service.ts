import { Redis } from "ioredis";
import { RedisUtil } from "src/utils/redis.util";
import { Collection } from "src/types/common.types";
import { TokenUtils } from "src/utils/token.util";
import { CustomError } from "src/utils/error.util";
import { PasswordUtils } from "src/utils/password.util";
import { redisChannels } from "src/consts/app.consts";
import { UserInstance } from "src/utils/user.util";

export class UserService {
  private redis: RedisUtil;
  private passwordUtil: PasswordUtils;
  private tokenUtil: TokenUtils;
  private channels: Collection<string>;

  constructor(sub: Redis, pub: Redis, rdb: Redis) {
    this.redis = new RedisUtil(sub, pub, rdb);
    this.passwordUtil = new PasswordUtils();
    this.tokenUtil = new TokenUtils();
    this.channels = redisChannels.responses;
  }

  async register(message: string) {
    const { email, name, password } = this.redis.parse(message);
    const hashedPassword = this.passwordUtil.hash(password);
    const user = new UserInstance(email, name, hashedPassword);
    await this.redis.set(email, user);
    const authData = this.redis.stringify({ email, password });
    await this.login(authData);
  }

  async login(message: string) {
    const { email, password } = this.redis.parse(message);
    const account = await this.redis.get(email);
    const similar = this.passwordUtil.compare(password, account.password);

    if (!account.password || !similar) {
      const error = new CustomError("Auth Error", "Invalid Data");
      await this.redis.publish(this.channels.error, error);
      return;
    }

    const token = this.tokenUtil.generate(email);
    await this.redis.publish(this.channels.login, { token });
  }
}
