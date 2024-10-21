import Redis from "ioredis";

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
  // password: '', // Optional
  // tls: {
  // Optional TLS configuration
  //   ca: [fs.readFileSync('/path/to/ca.crt')],
  //   key: fs.readFileSync('/path/to/redis.key'),
  //   cert: fs.readFileSync('/path/to/redis.crt'),
  // },
});

export default redis;
