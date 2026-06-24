import { createApp } from '@/app';
import { config } from '@/config';

// Точка входа: поднимает HTTP-сервер url-task.
const app = createApp();

const server = app.listen(config.port, config.host, () => {
  console.log(
    `[url-task] listening on http://${config.host}:${config.port} (data dir: ${config.dataDir})`,
  );
});

const shutdown = (signal: string): void => {
  console.log(`[url-task] received ${signal}, shutting down...`);
  server.close(() => process.exit(0));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
