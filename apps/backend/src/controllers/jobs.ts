import { Router, type Request, type Response, type NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

import { JobsNotFoundError, UrlNotFoundError } from '@/entities/jobs/jobsErrors';
import type { JobsService } from '@/entities/jobs/jobService';
import { BDNotFoundError } from '@/services/errorService';

/** Контроллер для задач (jobs). */
export function createGetDataRouter(jobService: JobsService): Router {
  const router = Router();

  /**
   * @openapi
   * /api/jobs:
   *   get:
   *     tags: [jobs]
   *     summary: Возвращает список задач с пагинацией
   *     parameters:
   *       - in: query
   *         name: page
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Номер страницы
   *       - in: query
   *         name: limit
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *         description: Количество элементов на странице
   *     responses:
   *       200:
   *         description: Пагинированный список задач (отсортирован по createdAt DESC)
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaginatedJobsResponse'
   *       500:
   *         description: BD не найдена
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/jobs', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));

      const jobs = await jobService.getJobs(page, limit);
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
   * /api/jobs/{id}/detail:
   *   get:
   *     tags: [jobs]
   *     summary: Возвращает задачу с подробной информацией о URL
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID задачи
   *     responses:
   *       200:
   *         description: Детальная информация о задаче
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/JobTaskDetail'
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
  router.get('/jobs/:id/detail', async (req: Request, res: Response, next: NextFunction) => {
    const jobId = req.params?.id;

    if (!jobId) {
      res.status(400).json({ error: 'Job id is required' });
      return;
    }

    try {
      const jobs = await jobService.getJobByIdDetail(String(jobId));
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
   * /api/jobs/{id}/activation:
   *   get:
   *     tags: [jobs]
   *     summary: Активирует задачу (запускает проверку URL)
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID задачи
   *     responses:
   *       200:
   *         description: Задача активирована
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
  router.get('/jobs/:id/activation', async (req: Request, res: Response, next: NextFunction) => {
    const jobId = req.params?.id;

    if (!jobId) {
      res.status(400).json({ error: 'Job id is required' });
      return;
    }

    try {
      const jobs = await jobService.getJobByIdActivation(String(jobId));
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
   *               $ref: '#/components/schemas/CreateJobResponse'
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
  const validateCreateJob = [
    body('urls')
      .isArray({ min: 1 })
      .withMessage('Not added url by task'),
    body('urls.*')
      .isString()
      .trim()
      .isURL({
        require_protocol: true,
        protocols: ['http', 'https'],
        disallow_auth: true,
      })
      .withMessage('Each URL must be a valid http/https url'),
  ];

  router.post('/jobs', validateCreateJob, async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array().map((e) => e.msg).join('; ') });
      return;
    }

    const urls: string[] = req.body.urls;

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

  /**
   * @openapi
   * /api/jobs/{id}/tasks:
   *   get:
   *     tags: [jobs]
   *     summary: Возвращает список URL для задачи
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID задачи
   *     responses:
   *       200:
   *         description: Список URL задачи
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/TaskUrl'
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

  /**
   * @openapi
   * /api/tasks/{id}:
   *   get:
   *     tags: [jobs]
   *     summary: Возвращает URL-ссылку по ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID URL-ссылки
   *     responses:
   *       200:
   *         description: URL-ссылка
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TaskUrl'
   *       400:
   *         description: ID не указан
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: URL-ссылка не найдена
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
