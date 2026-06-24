import cors from 'cors';
import express, { type Express, type Request, type Response } from 'express';
import swaggerUi from 'swagger-ui-express';

import { createGetDataRouter } from './controllers/jobs';
import { buildOpenApiSpec } from './openapi';
import { JobService } from './services/jobService';

const openApiSpec = buildOpenApiSpec();

/** Создаёт Express-приложение: API процессов, OpenAPI и Swagger UI. */
export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api', createGetDataRouter(new JobService()));

  app.get('/openapi.json', (_req, res) => {
    res.json(openApiSpec);
  });

  app.use(
    '/swagger',
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
      customSiteTitle: 'Документация API url-task',
      swaggerOptions: {
        url: '/openapi.json',
        displayRequestDuration: true,
      },
    }),
  );

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });

  app.use((err: unknown, _req: Request, res: Response): void => {
    console.error('[url-task] необработанная ошибка:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  return app;
}
