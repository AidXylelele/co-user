import { Redis } from "ioredis";
import { RedisUtil } from "src/utils/redis.util";
import { TokenUtils } from "src/utils/token.util";
import { CustomError } from "src/utils/error.util";
import { PasswordUtils } from "src/utils/password.util";
import { UserInstance } from "src/utils/user.util";
import { authTemplates } from "src/consts/app.consts";

export class UserService extends RedisUtil {
  private passwordUtil: PasswordUtils;
  private tokenUtil: TokenUtils;

  constructor(sub: Redis, pub: Redis, rdb: Redis) {
    super(sub, pub, rdb, authTemplates);
    this.passwordUtil = new PasswordUtils();
    this.tokenUtil = new TokenUtils();
  }

  async register(message: string) {
    const { email, name, password } = this.parse(message);
    const hashedPassword = this.passwordUtil.hash(password);
    const user = new UserInstance(email, name, hashedPassword);
    await this.set(email, user);
    const authData = this.stringify({ email, password });
    await this.login(authData);
  }

  async login(message: string) {
    const { email, password } = this.parse(message);
    const account = await this.get(email);
    const similar = this.passwordUtil.compare(password, account.password);

    if (!account.password || !similar) {
      const error = new CustomError("Auth Error", "Invalid Data");
      const channel = this.channels.responses.auth.error;
      await this.publish(channel, error);
      return;
    }

    const token = this.tokenUtil.generate(email);
    const channel = this.channels.responses.auth.login;
    await this.publish(channel, { token });
  }
}
