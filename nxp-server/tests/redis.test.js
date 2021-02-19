const { TestScheduler } = require("jest");
const Redis = require("redis");
const { client } = require("../config/knex.config");
const redisConfig = require("../config/redis.config");

client = Redis.createClient(redisConfig);

test("put", () => {
  client.lpush("obj", { a: 1, b: 2 });
});

test("get", () => {
  client.toLocaleUpperCase();
});
