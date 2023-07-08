require("dotenv").config();
const { Redis } = require("ioredis");
const { AuthService } = require("./services/auth.service");
const { config } = require("./config/redis.config");
const { channels } = require("./consts/app.consts");

const client = new Redis(config);
const subscriber = new Redis(config);

const authService = new AuthService(client);

subscriber.subscribe(channels.register);

subscriber.on("message", async (channel, message) => {
  if (channel === channels.register) {
    await authService.register(message);
  }
});

subscriber.subscribe(channels.login);

subscriber.on("message", async (channel, message) => {
  if (channel === channels.login) {
    await authService.login(message);
  }
});
