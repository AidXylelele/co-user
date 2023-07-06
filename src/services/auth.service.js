const { passwordUtils } = require("../utils/password.util");
const { RedisUtil } = require("../utils/redis.util");
const { tokenUtils } = require("../utils/token.util");

class AuthService extends RedisUtil {
  constructor(client) {
    super(client);
    this.errorMsg = "login-error";
    this.successMsg = "login-success";
  }

  async register(message) {
    const { email, password } = this.messageParse(message);
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.setAsync(email, hashedPassword);
  }

  async login(message) {
    const { email, password } = this.messageParse(message);
    const hashedPassword = await this.getAsync(message);
    const similar = await passwordUtils.comparePassword(
      password,
      hashedPassword
    );

    if (!hashedPassword || !similar) {
      client.publish(this.errorMsg, email);
      return;
    }

    const token = tokenUtils.generate(email);
    const response = JSON.stringify({ email, token });
    client.publish(this.successMsg, response);
  }
}

module.exports = { AuthService };
