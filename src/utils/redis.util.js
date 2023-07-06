class RedisUtil {
  messageParse(message) {
    return JSON.parse(message);
  }
  stringifyResponse(message) {
    return JSON.stringify(message);
  }
}

module.exports = { RedisUtil };
