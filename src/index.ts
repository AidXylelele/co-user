require("dotenv").config();
import { Redis } from "ioredis";
import { config } from "./config/redis.config";
import { UserService } from "./services/user.service";
import { redisChannels } from "./consts/app.consts";

const channels = redisChannels.requests;

const sub = new Redis(config);
const pub = new Redis(config);
const pool = new Redis(config);

const userService = new UserService(sub, pub, pool);

sub.subscribe(channels.login);
sub.subscribe(channels.register);

sub.on("message", async (channel: string, message: string) => {
  const { register, login } = channels;
  if (channel === register) {
    await userService.register(message);
  }
  if (channel === login) {
    await userService.login(message);
  }
});
