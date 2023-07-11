const { CustomError } = require("../utils/error.util");
const { passwordUtils } = require("../utils/password.util");
const { RedisUtil } = require("../utils/redis.util");
const { tokenUtils } = require("../utils/token.util");

class AuthService extends RedisUtil {
  constructor(client, channels) {
    this.client = client;
    this.channels = channels;
  }

  async register(message) {
    const { email, name, password } = this.parse(message);
    const hashedPasssword = passwordUtils.hash(password);
    const id = crypto.randomUUID();
    const data = { id, name, password: hashedPasssword };
    const stringifiedData = this.stringify(data);
    await this.client.set(email, stringifiedData);
    return await this.login({ email, password });
  }

  async login(message) {
    const { email, password } = this.parse(message);
    const data = await this.client.get(email);
    const parsedData = this.parse(data);
    const similar = passwordUtils.compare(password, parsedData.password);

    if (!parsedData.password || !similar) {
      const error = new CustomError("Auth Error", "Invalid Data");
      this.client.publish(this.channels.error, error);
      return;
    }

    const token = tokenUtils.generate(email);
    const response = this.stringify({ token });
    this.client.publish(this.channels.login, response);
  }
}

module.exports = { AuthService };
