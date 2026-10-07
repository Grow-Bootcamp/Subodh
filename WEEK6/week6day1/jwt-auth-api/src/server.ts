import app from './app';
import { env } from './config/env';

function start(): void {
  const server = app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
    console.log(`Environment: ${env.NODE_ENV ?? 'development'}`);
  });

  server.on('error', (error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
}

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});

start();
