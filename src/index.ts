require("dotenv").config();
import { Redis } from "ioredis";
import { config } from "./config/redis.config";
import { UserService } from "./services/user.service";

const sub = new Redis(config);
const pub = new Redis(config);
const pool = new Redis(config);

const userService = new UserService(sub, pub, pool);

sub.on("message", async (channel: string, message: string) => {
  const { register, login } = userService.channels.requests.auth;
  if (channel === register) {
    await userService.register(message);
  }
  if (channel === login) {
    await userService.login(message);
  }
});
