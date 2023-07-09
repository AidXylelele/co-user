class RedisUtil {
  parse(message) {
    return JSON.parse(message);
  }
  stringify(message) {
    return JSON.stringify(message);
  }
}

module.exports = { RedisUtil };
