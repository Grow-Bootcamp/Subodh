import app from "./app.js";
import { env } from "./config/env.js";

app.listen(env.PORT, () => {
  console.log(`task-api listening on http://localhost:${env.PORT}`);
  console.log(`NODE_ENV=${env.NODE_ENV}`);
});
