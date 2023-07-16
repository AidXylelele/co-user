import { CustomError } from "src/utils/error.util";
import { PasswordUtils } from "src/utils/password.util";
import { RedisUtil } from "src/utils/redis.util";
import { TokenUtils } from "src/utils/token.util";

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
  private client: any;
  private redis: RedisUtil;
  private passwordUtil: PasswordUtils;
  private tokenUtil: TokenUtils;

  constructor(client: any) {
    this.client = client;
    this.redis = new RedisUtil();
    this.passwordUtil = new PasswordUtils();
    this.tokenUtil = new TokenUtils();
  }

  async register(message: string) {
    const { email, name, password } = this.redis.parse(message);
    const hashedPassword = this.passwordUtil.hash(password);
    const user = new UserInstance(email, name, hashedPassword);
    await this.client.set(email, this.redis.stringify(user));
    return await this.login(this.redis.stringify({ email, password }));
  }

  async login(message: string) {
    const { email, password } = this.redis.parse(message);
    const data = await this.client.get(email);
    const parsed = this.redis.parse(data);
    const similar = this.passwordUtil.compare(password, parsed.password);

    if (!parsed.password || !similar) {
      const error = new CustomError("Auth Error", "Invalid Data");
      this.client.publish(this.redis.channels.error, error);
      return;
    }

    const token = this.tokenUtil.generate(email);
    const response = this.redis.stringify({ token });
    this.client.publish(this.redis.channels.login, response);
  }
}
