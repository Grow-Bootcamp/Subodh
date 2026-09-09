# Week 2 Day 2

Demos covering Docker containerization, Google OAuth, and TypeScript fundamentals.

## Projects

### docker-demo

Express.js application containerized with Docker using Node 20.

```bash
docker build -t docker-demo .
docker run -p 4000:4000 docker-demo
```

### oauth-demo

Express.js application with Google OAuth authentication using `googleapis` and `express-session`.

Requires a `.env` file with Google Cloud OAuth credentials.

```bash
npm install
node server.js
```

### typescript-demo

TypeScript project demonstrating types, interfaces, functions, and generics.

```bash
npm install
npm run dev
```
