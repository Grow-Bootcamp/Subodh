const http = require("node:http");
const { Readable } = require("node:stream");

// HTTP Server as EventEmitter
const server = http.createServer((req, res) => {
  res.end("OK");
});

server.on("listening", () => {
  console.log("Server listening on port 3000");
});

server.on("request", (req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
});

server.listen(3000);

// Process as EventEmitter
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM");
  server.close(() => process.exit(0));
});

// Readable Stream as EventEmitter
const stream = Readable.from(["hello", " ", "world"]);
stream.on("data", (chunk) => console.log("Data:", chunk.toString()));
stream.on("end", () => console.log("Stream ended"));
