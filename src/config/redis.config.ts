export const config = {
  port: 6379,
  host: "redis",
  username: process.env.REDIS_USERNAME, // needs Redis >= 6
  password: process.env.REDIS_PASSWORD,
  db: 0,
};
