const bcrypt = require("bcrypt");

class PasswordUtils {
  constructor(util) {
    this.util = util;
    this.salt = 10;
  }
  async hashPassword(password) {
    return await this.util.hash(password, this.salt);
  }
  async comparePassword(password, hashedPassword) {
    return await this.util.compare(password, hashedPassword);
  }
}

const passwordUtils= new PasswordUtils(bcrypt);

module.exports = { passwordUtils };
