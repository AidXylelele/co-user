import { Redis } from "ioredis";
import { RedisUtil } from "src/utils/redis.util";
import { TokenUtils } from "src/utils/token.util";
import { CustomError } from "src/utils/error.util";
import { PasswordUtils } from "src/utils/password.util";
import { redisChannels } from "src/consts/app.consts";
import { Collection } from "src/types/common.types";

class UserInstance {
  public email: string;
  public name: string;
  public password: string;
  public pending: any[];
  public resolved: any[];
  public rejected: any[];
  public balance: number;

  constructor(email: string, name: string, password: string) {
    this.email = email;
    this.name = name;
    this.password = password;
    this.pending = [];
    this.rejected = [];
    this.resolved = [];
    this.balance = 0;
  }
}

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
    const stringifiedAuthData = this.redis.stringify({ email, password });
    const token = await this.login(stringifiedAuthData);
    return token;
  }

  async login(message: string) {
    const { email, password } = this.redis.parse(message);
    const account = await this.redis.get(email);
    const similar = this.passwordUtil.compare(password, account.password);

    if (!account.password || !similar) {
      const error = new CustomError("Auth Error", "Invalid Data");
      this.redis.publish(this.channels.error, error);
      return;
    }

    const token = this.tokenUtil.generate(email);
    const response = this.redis.stringify({ token });
    this.redis.publish(this.channels.login, response);
  }
}
