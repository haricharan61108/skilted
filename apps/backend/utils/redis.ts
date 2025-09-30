import IORedis from "ioredis";

const portno = Number(process.env.REDIS_PORT) || 6379;

export const redis = new IORedis({
    host: "127.0.0.1",
    port: portno
})