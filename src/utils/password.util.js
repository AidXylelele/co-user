const crypto = require("node:crypto");

class PasswordUtils {
  constructor(util, salt) {
    this.util = util;
    this.salt = salt;
    this.length = 64;
  }
  hash(password) {
    return crypto.scryptSync(password, this.salt, this.length).toString("hex");
  }
  compare(input, hashedPassword) {
    const hashedInput = this.hashPassword(input);
    return hashedInput === hashedPassword;
  }
}

const salt = process.env.SECRET_KEY;
const passwordUtils = new PasswordUtils(crypto, salt);

module.exports = { passwordUtils };
