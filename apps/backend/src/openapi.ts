import path from 'path';

import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'url-task API',
      version: '0.1.0',
      description: 'Бэкенд url-task: создание задач (jobs) с проверкой доступности URL.',
    },
    servers: [{ url: '/', description: 'Текущий хост' }],
    tags: [{ name: 'jobs', description: 'Операции с задачами (jobs)' }],
    components: {
      schemas: {
        JobTask: {
          type: 'object',
          required: ['id', 'createdAt'],
          properties: {
            id: { type: 'string', example: 'V1StGXR8_Z5jdHi6B-myT' },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-06-23T10:00:00.000Z',
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'completed', 'cancelled', 'failed'],
              nullable: true,
              example: 'pending',
            },
            stats: {
              type: 'string',
              enum: ['success', 'error'],
              nullable: true,
              example: null,
            },
            urlIds: {
              type: 'array',
              items: { type: 'string' },
              example: [],
            },
          },
        },
        TaskUrl: {
          type: 'object',
          required: ['id', 'jobId', 'url'],
          properties: {
            id: { type: 'string', example: 'V1StGXR8_Z5jdHi6B-myT' },
            jobId: { type: 'string', example: 'V1StGXR8_Z5jdHi6B-myT' },
            url: { type: 'string', example: 'https://example.com' },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'success', 'error', 'cancelled'],
              nullable: true,
              example: 'pending',
            },
            httpStatus: {
              type: 'integer',
              example: 200,
              nullable: true,
            },
            errorMessage: {
              type: 'string',
              nullable: true,
              example: null,
            },
            startTimeJob: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: null,
            },
            endTimeJob: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: null,
            },
          },
        },
        CreateJobInput: {
          type: 'object',
          required: ['urls'],
          properties: {
            urls: {
              type: 'array',
              items: { type: 'string', format: 'uri' },
              example: ['https://example.com', 'https://test.com'],
            },
          },
        },
        Error: {
          type: 'object',
          required: ['error'],
          properties: {
            error: {
              type: 'string',
              example: 'Job "V1StGXR8_Z5jdHi6B-myT" was not found',
            },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, 'controllers', '*.{ts,js}'), path.join(__dirname, 'app.{ts,js}')],
};

/** Собирает объект спецификации OpenAPI из JSDoc в исходниках. */
export function buildOpenApiSpec(): object {
  return swaggerJSDoc(options);
}
