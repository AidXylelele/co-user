const { promisify } = require("util");

class RedisUtil {
  constructor(client) {
    this.util = promisify;
    this.client = client;
  }

  _bindContext(fn, context) {
    return this.util(fn).bind(context);
  }

  messageParse(message) {
    return JSON.parse(message);
  }

  async getAsync(param) {
    const fn = this._bindContext(this.client.get, this.client);
    return await fn(param);
  }

  async setAsync(...args) {
    const fn = this._bindContext(this.client.set, this.client);
    return await fn(...args);
  }
}

module.exports = { RedisUtil };
