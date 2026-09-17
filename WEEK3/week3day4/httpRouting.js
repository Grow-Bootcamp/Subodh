const http = require("node:http");

const port = process.env.PORT || 3000;
let users = [
  { id: 1, name: "Subodh" },
  { id: 2, name: "Samit" },
];
let nextId = 3;

function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(JSON.parse(body || "{}")));
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method;

  const send = (status, data) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  };

  // GET /
  if (method === "GET" && path === "/") {
    return send(200, { message: "Welcome to Node.js HTTP API" });
  }

  // GET /api/users
  if (method === "GET" && path === "/api/users") {
    return send(200, users);
  }

  // GET /api/users/:id
  if (method === "GET" && path.startsWith("/api/users/")) {
    const id = Number(path.split("/")[3]);
    const user = users.find((u) => u.id === id);
    return user ? send(200, user) : send(404, { error: "User not found" });
  }

  // POST /api/users
  if (method === "POST" && path === "/api/users") {
    const body = await parseBody(req);
    const user = { id: nextId++, name: body.name };
    users.push(user);
    return send(201, user);
  }

  // PUT /api/users/:id
  if (method === "PUT" && path.startsWith("/api/users/")) {
    const id = Number(path.split("/")[3]);
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return send(404, { error: "User not found" });
    const body = await parseBody(req);
    users[idx] = { ...users[idx], ...body, id };
    return send(200, users[idx]);
  }

  // DELETE /api/users/:id
  if (method === "DELETE" && path.startsWith("/api/users/")) {
    const id = Number(path.split("/")[3]);
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return send(404, { error: "User not found" });
    const deleted = users.splice(idx, 1)[0];
    return send(200, deleted);
  }

  send(404, { error: "Route not found" });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
