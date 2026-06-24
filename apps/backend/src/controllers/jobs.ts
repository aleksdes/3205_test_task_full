import { Router, type Request, type Response, type NextFunction } from 'express';

import { JobsNotFoundError, UrlNotFoundError } from '@/entities/jobs/jobsErrors';
import type { JobsService } from '@/entities/jobs/jobService';
import { BDNotFoundError } from '@/services/errorService';
import isUrl from 'swift-url-check';

/** Контроллер для задач (jobs). */
export function createGetDataRouter(jobService: JobsService): Router {
  const router = Router();

  /**
   * @openapi
   * /api/jobs:
   *   get:
   *     tags: [jobs]
   *     summary: Возвращает список всех задач
   *     responses:
   *       200:
   *         description: Список задач
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/JobTask'
   *       500:
   *         description: BD не найдена
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/jobs', async (_: Request, res: Response, next: NextFunction) => {
    try {
      const jobs = await jobService.getJobs();
      res.json(jobs);
    } catch (err) {
      if (err instanceof BDNotFoundError) {
        res.status(500).json({ error: err.message });
        return;
      }

      next(err);
    }
  });

  /**
   * @openapi
   * /api/jobs/{id}:
   *   get:
   *     tags: [jobs]
   *     summary: Возвращает задачу по ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID задачи
   *     responses:
   *       200:
   *         description: Задача
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/JobTask'
   *       400:
   *         description: ID не указан
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Задача не найдена
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: BD не найдена
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/jobs/:id', async (req: Request, res: Response, next: NextFunction) => {
    const jobId = req.params?.id;

    if (!jobId) {
      res.status(400).json({ error: 'Job id is required' });
      return;
    }

    try {
      const jobs = await jobService.getJobById(String(jobId));
      res.json(jobs);
    } catch (err) {
      if (err instanceof BDNotFoundError) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (err instanceof JobsNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      next(err);
    }
  });

  /**
   * @openapi
   * /api/jobs:
   *   post:
   *     tags: [jobs]
   *     summary: Создаёт новую задачу с проверкой URL
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateJobInput'
   *     responses:
   *       200:
   *         description: Задача создана
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items: {}
   *       400:
   *         description: Некорректные URL
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: BD не найдена
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/jobs', async (req: Request, res: Response, next: NextFunction) => {
    const urls: string[] = req.body.urls || [];

    if (!urls.length) {
      res.status(400).json({ error: 'Not added url by task' });
      return;
    }

    if (!urls.every((url) => isUrl(url, { allowLocal: false }))) {
      res.status(400).json({ error: 'All urls must be a valid url' });
      return;
    }

    try {
      const dataJob = await jobService.createJob({ urls });
      res.status(200).json(dataJob);
    } catch (err) {
      if (err instanceof BDNotFoundError) {
        res.status(500).json({ error: err.message });
        return;
      }
      next(err);
    }
  });

  /**
   * @openapi
   * /api/jobs/{id}:
   *   delete:
   *     tags: [jobs]
   *     summary: Удаляет задачу по ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID задачи
   *     responses:
   *       200:
   *         description: Задача удалена
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *       400:
   *         description: ID не указан
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Задача не найдена
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: BD не найдена
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.delete('/jobs/:id', async (req: Request, res: Response, next: NextFunction) => {
    const jobId = req.params?.id;

    if (!jobId) {
      res.status(400).json({ error: 'Job id is required' });
      return;
    }

    try {
      await jobService.deleteJob(String(jobId));
      res.status(200).json({});
    } catch (err) {
      if (err instanceof BDNotFoundError) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (err instanceof JobsNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      next(err);
    }
  });

  router.get('/jobs/:id/tasks', async (req: Request, res: Response, next: NextFunction) => {
    const jobId = req.params?.id;

    if (!jobId) {
      res.status(400).json({ error: 'Job id is required' });
      return;
    }

    try {
      const taskUrls = await jobService.getUrlsJob(String(jobId));
      res.status(200).json(taskUrls);
    } catch (err) {
      if (err instanceof BDNotFoundError) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (err instanceof JobsNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      next(err);
    }
  });

  router.get('/tasks/:id', async (req: Request, res: Response, next: NextFunction) => {
    const taskId = req.params?.id;

    if (!taskId) {
      res.status(400).json({ error: 'Url id is required' });
      return;
    }

    try {
      const task = await jobService.getUrl(String(taskId));
      res.status(200).json(task);
    } catch (err) {
      if (err instanceof BDNotFoundError) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (err instanceof UrlNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      next(err);
    }
  });

  return router;
}
