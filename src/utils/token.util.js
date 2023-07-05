const jwt = require("jsonwebtoken");

class TokenUtils {
  constructor(jwt) {
    this.jwt = jwt;
  }

  generate(username) {
    return this.jwt.sign({ username }, process.env.SECRET_KEY);
  }

  decode(token) {
    return this.jwt.decode(token);
  }
}

const tokenUtils = new TokenUtils(jwt);

module.exports = { tokenUtils };
