const { passwordUtils } = require("../utils/password.util");
const { RedisUtil } = require("../utils/redis.util");
const { tokenUtils } = require("../utils/token.util");

class AuthService extends RedisUtil {
  constructor(redis) {
    this.redis = redis;
    this.errorMsg = "login-error";
    this.successMsg = "login-success";
  }

  async register(message) {
    const { email, password } = this.messageParse(message);
    const hashedPassword = await passwordUtils.hashPassword(password);
    await this.redis.set(email, hashedPassword);
    return await this.login(message);
  }

  async login(message) {
    const { email, password } = this.messageParse(message);
    const hashedPassword = await this.redis.get(message);
    const similar = await passwordUtils.comparePassword(
      password,
      hashedPassword
    );

    if (!hashedPassword || !similar) {
      this.redis.publish(this.errorMsg, email);
      return;
    }

    const token = tokenUtils.generate(email);
    const response = this.stringifyResponse({ email, token });
    this.redis.publish(this.successMsg, response);
  }
}

module.exports = { AuthService };
