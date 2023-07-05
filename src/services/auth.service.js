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
    const { username, password } = this.messageParse(message);
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.setAsync(username, hashedPassword);
  }

  async login(message) {
    const { username, password } = this.messageParse(message);
    const hashedPassword = await this.getAsync(message);
    const similar = await passwordUtils.comparePassword(
      password,
      hashedPassword
    );

    if (!hashedPassword || !similar) {
      client.publish(this.errorMsg, username);
      return;
    }

    const token = tokenUtils.generate(username);
    const response = JSON.stringify({ username, token });
    client.publish(this.successMsg, response);
  }
}

module.exports = { AuthService };
