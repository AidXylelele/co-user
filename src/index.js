require("dotenv").config();
const redis = require("redis");
const { AuthService } = require("./services/auth.service");

const client = redis.createClient();
const subscriber = redis.createClient();

const authService = new AuthService(client);

subscriber.subscribe("register");

subscriber.on("message", async (channel, message) => {
  if (channel === "register") {
    await authService.register(message);
  }
});

subscriber.subscribe("login");

subscriber.on("message", async (channel, message) => {
  if (channel === "login") {
    await authService.login(message);
  }
});
