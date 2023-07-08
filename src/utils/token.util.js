const jwt = require("jsonwebtoken");

class TokenUtils {
  constructor(jwt) {
    this.jwt = jwt;
  }

  generate(email) {
    return this.jwt.sign({ email }, process.env.SECRET_KEY);
  }
}

const tokenUtils = new TokenUtils(jwt);

module.exports = { tokenUtils };
