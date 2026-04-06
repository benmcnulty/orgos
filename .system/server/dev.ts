import { createOrgosApp } from "./app";
const DEFAULT_PORT = 52464;
const port = process.env.PORT ? Number(process.env.PORT) : DEFAULT_PORT;

const app = createOrgosApp(process.cwd());
app.startWatchers();

const server = Bun.serve({
  hostname: "127.0.0.1",
  idleTimeout: 30,
  port,
  fetch: app.fetch,
});

console.log(`orgos dev server running at ${server.url}`);
