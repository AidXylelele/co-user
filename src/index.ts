require("dotenv").config();
import { Redis } from "ioredis";
import { config } from "./config/redis.config";
import { UserService } from "./services/user.service";
import { channels } from "./consts/app.consts";

const client = new Redis(config);
const subscriber = new Redis(config);

const userService = new UserService(client);

subscriber.subscribe(channels.login);
subscriber.subscribe(channels.register);

subscriber.on("message", async (channel: string, message: string) => {
  const { register, login } = channels;
  if (channel === register) {
    await userService.register(message);
  }
  if (channel === login) {
    await userService.login(message);
  }
});
