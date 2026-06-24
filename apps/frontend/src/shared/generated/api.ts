/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export type ChangeStepNameCreateData = any;

export interface ChangeStepNameCreatePayload {
  /** initialIndex шага процесса, название которого нужно изменить */
  stepInitialIndex: number;
  /** Новое значение поля name шага процесса */
  stepName: string;
  /**
   * Название процесса (и файла процесса, без расширения .json)
   * @default "wf1"
   */
  wfName?: string;
}

export type ChangeStepXyCreateData = any;

export interface ChangeStepXyCreatePayload {
  /** initialIndex шага процесса, координаты которого нужно изменить */
  stepInitialIndex: number;
  /**
   * Название процесса (и файла процесса, без расширения .json)
   * @default "wf1"
   */
  wfName?: string;
  /** Новое значение координаты x шага процесса */
  x: number;
  /** Новое значение координаты y шага процесса */
  y: number;
}

export interface CreateJobInput {
  /** @example ["https://example.com","https://test.com"] */
  urls: string[];
}

export interface CreateJobResponse {
  /** @example "V1StGXR8_Z5jdHi6B-myT" */
  jobId: string;
}

export type CreateStepCreateData = any;

export interface CreateStepCreatePayload {
  /** Необязательный цвет блока на схеме (например, HEX) */
  color?: string;
  /** name нового шага процесса */
  stepName: string;
  /** Название процесса (и файла процесса, без расширения .json) */
  wfName: string;
  /** x нового шага процесса */
  x: number;
  /** y нового шага процесса */
  y: number;
}

export type DeleteStepCreateData = any;

export interface DeleteStepCreatePayload {
  /** initialIndex удаляемого шага */
  stepInitialIndex: number;
  /** Название процесса (и файла процесса, без расширения .json) */
  wfName: string;
}

export interface Error {
  /** @example "Job "V1StGXR8_Z5jdHi6B-myT" was not found" */
  error: string;
}

export type GetWorkflowData = any;

export interface GetWorkflowParams {
  /**
   * Название процесса (и файла процесса, без расширения .json)
   * @default "wf1"
   * @example "wf1"
   */
  wfName?: string;
}

export interface JobTask {
  /**
   * @format date-time
   * @example "2026-06-23T10:00:00.000Z"
   */
  createdAt: string;
  /** @example "V1StGXR8_Z5jdHi6B-myT" */
  id: string;
  /** @example null */
  stats?: JobTaskStatsEnum;
  /** @example "pending" */
  status?: JobTaskStatusEnum;
  /** @example [] */
  urlIds?: string[];
}

export interface JobTaskDetail {
  /**
   * @format date-time
   * @example "2026-06-23T10:00:00.000Z"
   */
  createdAt: string;
  /** @example "V1StGXR8_Z5jdHi6B-myT" */
  id: string;
  /** @example null */
  stats?: JobTaskDetailStatsEnum;
  /** @example "pending" */
  status?: JobTaskDetailStatusEnum;
  urls: TaskUrl[];
}

/** @example null */
export enum JobTaskDetailStatsEnum {
  Success = "success",
  Error = "error",
}

/** @example "pending" */
export enum JobTaskDetailStatusEnum {
  Pending = "pending",
  InProgress = "in_progress",
  Completed = "completed",
  Cancelled = "cancelled",
  Failed = "failed",
}

/** @example null */
export enum JobTaskStatsEnum {
  Success = "success",
  Error = "error",
}

/** @example "pending" */
export enum JobTaskStatusEnum {
  Pending = "pending",
  InProgress = "in_progress",
  Completed = "completed",
  Cancelled = "cancelled",
  Failed = "failed",
}

export type JobsCreateData = CreateJobResponse;

export type JobsDeleteData = object;

export type JobsDetailData = JobTask;

export type JobsDetailDetailData = JobTaskDetail;

export type JobsListData = JobTask[];

export type JobsTasksDetailData = TaskUrl[];

export interface TaskUrl {
  /**
   * @format date-time
   * @example null
   */
  endTimeJob?: string | null;
  /** @example null */
  errorMessage?: string | null;
  /** @example 200 */
  httpStatus?: number | null;
  /** @example "V1StGXR8_Z5jdHi6B-myT" */
  id: string;
  /** @example "V1StGXR8_Z5jdHi6B-myT" */
  jobId: string;
  /**
   * @format date-time
   * @example null
   */
  startTimeJob?: string | null;
  /** @example "pending" */
  status?: TaskUrlStatusEnum;
  /** @example "https://example.com" */
  url: string;
}

/** @example "pending" */
export enum TaskUrlStatusEnum {
  Pending = "pending",
  InProgress = "in_progress",
  Success = "success",
  Error = "error",
  Cancelled = "cancelled",
}

export type TasksDetailData = TaskUrl;

export namespace Workflow {
  /**
   * No description
   * @tags workflow
   * @name ChangeStepNameCreate
   * @summary Изменяет название шага
   * @request POST:/workflow/changeStepName
   */
  export namespace ChangeStepNameCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ChangeStepNameCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = ChangeStepNameCreateData;
  }

  /**
   * No description
   * @tags workflow
   * @name ChangeStepXyCreate
   * @summary Изменяет координаты шага на схеме (x, y)
   * @request POST:/workflow/changeStepXY
   */
  export namespace ChangeStepXyCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ChangeStepXyCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = ChangeStepXyCreateData;
  }

  /**
   * No description
   * @tags workflow
   * @name CreateStepCreate
   * @summary Создает новый шаг процесса
   * @request POST:/workflow/createStep
   */
  export namespace CreateStepCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateStepCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = CreateStepCreateData;
  }

  /**
   * No description
   * @tags workflow
   * @name DeleteStepCreate
   * @summary Удаляет шаг процесса по stepInitialIndex
   * @request POST:/workflow/deleteStep
   */
  export namespace DeleteStepCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DeleteStepCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteStepCreateData;
  }

  /**
   * No description
   * @tags workflow
   * @name GetWorkflow
   * @summary Возвращает данные процесса (workflow)
   * @request GET:/workflow/get
   */
  export namespace GetWorkflow {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Название процесса (и файла процесса, без расширения .json)
       * @default "wf1"
       * @example "wf1"
       */
      wfName?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetWorkflowData;
  }
}

export namespace Jobs {
  /**
   * No description
   * @tags jobs
   * @name JobsCreate
   * @summary Создаёт новую задачу с проверкой URL
   * @request POST:/api/jobs
   */
  export namespace JobsCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateJobInput;
    export type RequestHeaders = {};
    export type ResponseBody = JobsCreateData;
  }

  /**
   * No description
   * @tags jobs
   * @name JobsDelete
   * @summary Удаляет задачу по ID
   * @request DELETE:/api/jobs/{id}
   */
  export namespace JobsDelete {
    export type RequestParams = {
      /** ID задачи */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = JobsDeleteData;
  }

  /**
   * No description
   * @tags jobs
   * @name JobsDetail
   * @summary Возвращает задачу по ID
   * @request GET:/api/jobs/{id}
   */
  export namespace JobsDetail {
    export type RequestParams = {
      /** ID задачи */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = JobsDetailData;
  }

  /**
   * No description
   * @tags jobs
   * @name JobsDetailDetail
   * @summary Возвращает задачу с подробной информацией о URL
   * @request GET:/api/jobs/{id}/detail
   */
  export namespace JobsDetailDetail {
    export type RequestParams = {
      /** ID задачи */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = JobsDetailDetailData;
  }

  /**
   * No description
   * @tags jobs
   * @name JobsList
   * @summary Возвращает список всех задач
   * @request GET:/api/jobs
   */
  export namespace JobsList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = JobsListData;
  }

  /**
   * No description
   * @tags jobs
   * @name JobsTasksDetail
   * @summary Возвращает список URL для задачи
   * @request GET:/api/jobs/{id}/tasks
   */
  export namespace JobsTasksDetail {
    export type RequestParams = {
      /** ID задачи */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = JobsTasksDetailData;
  }

  /**
   * No description
   * @tags jobs
   * @name TasksDetail
   * @summary Возвращает URL-ссылку по ID
   * @request GET:/api/tasks/{id}
   */
  export namespace TasksDetail {
    export type RequestParams = {
      /** ID URL-ссылки */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = TasksDetailData;
  }
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "/" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title url-task API
 * @version 0.1.0
 * @baseUrl /
 *
 * Бэкенд url-task: создание задач (jobs) с проверкой доступности URL.
 */
export class Api<SecurityDataType extends unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  workflow = {
    /**
     * No description
     *
     * @tags workflow
     * @name ChangeStepNameCreate
     * @summary Изменяет название шага
     * @request POST:/workflow/changeStepName
     */
    changeStepNameCreate: (data: ChangeStepNameCreatePayload, params: RequestParams = {}) =>
      this.http.request<ChangeStepNameCreateData, Error>({
        path: `/workflow/changeStepName`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags workflow
     * @name ChangeStepXyCreate
     * @summary Изменяет координаты шага на схеме (x, y)
     * @request POST:/workflow/changeStepXY
     */
    changeStepXyCreate: (data: ChangeStepXyCreatePayload, params: RequestParams = {}) =>
      this.http.request<ChangeStepXyCreateData, Error>({
        path: `/workflow/changeStepXY`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags workflow
     * @name CreateStepCreate
     * @summary Создает новый шаг процесса
     * @request POST:/workflow/createStep
     */
    createStepCreate: (data: CreateStepCreatePayload, params: RequestParams = {}) =>
      this.http.request<CreateStepCreateData, Error>({
        path: `/workflow/createStep`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags workflow
     * @name DeleteStepCreate
     * @summary Удаляет шаг процесса по stepInitialIndex
     * @request POST:/workflow/deleteStep
     */
    deleteStepCreate: (data: DeleteStepCreatePayload, params: RequestParams = {}) =>
      this.http.request<DeleteStepCreateData, Error>({
        path: `/workflow/deleteStep`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags workflow
     * @name GetWorkflow
     * @summary Возвращает данные процесса (workflow)
     * @request GET:/workflow/get
     */
    getWorkflow: (query: GetWorkflowParams, params: RequestParams = {}) =>
      this.http.request<GetWorkflowData, Error>({
        path: `/workflow/get`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  jobs = {
    /**
     * No description
     *
     * @tags jobs
     * @name JobsCreate
     * @summary Создаёт новую задачу с проверкой URL
     * @request POST:/api/jobs
     */
    jobsCreate: (data: CreateJobInput, params: RequestParams = {}) =>
      this.http.request<JobsCreateData, Error>({
        path: `/api/jobs`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags jobs
     * @name JobsDelete
     * @summary Удаляет задачу по ID
     * @request DELETE:/api/jobs/{id}
     */
    jobsDelete: (id: string, params: RequestParams = {}) =>
      this.http.request<JobsDeleteData, Error>({
        path: `/api/jobs/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags jobs
     * @name JobsDetail
     * @summary Возвращает задачу по ID
     * @request GET:/api/jobs/{id}
     */
    jobsDetail: (id: string, params: RequestParams = {}) =>
      this.http.request<JobsDetailData, Error>({
        path: `/api/jobs/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags jobs
     * @name JobsDetailDetail
     * @summary Возвращает задачу с подробной информацией о URL
     * @request GET:/api/jobs/{id}/detail
     */
    jobsDetailDetail: (id: string, params: RequestParams = {}) =>
      this.http.request<JobsDetailDetailData, Error>({
        path: `/api/jobs/${id}/detail`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags jobs
     * @name JobsList
     * @summary Возвращает список всех задач
     * @request GET:/api/jobs
     */
    jobsList: (params: RequestParams = {}) =>
      this.http.request<JobsListData, Error>({
        path: `/api/jobs`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags jobs
     * @name JobsTasksDetail
     * @summary Возвращает список URL для задачи
     * @request GET:/api/jobs/{id}/tasks
     */
    jobsTasksDetail: (id: string, params: RequestParams = {}) =>
      this.http.request<JobsTasksDetailData, Error>({
        path: `/api/jobs/${id}/tasks`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags jobs
     * @name TasksDetail
     * @summary Возвращает URL-ссылку по ID
     * @request GET:/api/tasks/{id}
     */
    tasksDetail: (id: string, params: RequestParams = {}) =>
      this.http.request<TasksDetailData, Error>({
        path: `/api/tasks/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
