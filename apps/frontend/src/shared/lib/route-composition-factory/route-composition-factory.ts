import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type {
  NavigationFailure,
  RouteLocationRaw,
  Router,
  RouteRecordRaw,
} from 'vue-router'
import type { z, ZodArray, ZodType } from 'zod'
import { isUndefined } from 'lodash-es'
import { computed, toValue } from 'vue'
import { useRouter } from 'vue-router'

export declare interface UseRouteCompositionReturn<Params> {
  /**
   * Вызывает метод router.push с заданными параметрами.
   * ---------------------------------------------------
   *
   * Можно использовать для программной навигации
   *
   * ```typescript
   * <script setup>
   *   const exampleRoute = routeFactory('example', {
   *     params: {
   *       id: z.number()
   *     }
   *   })
   *
   *  exampleRoute.push({
   *     params: {id: 1}
   *   }) // -> router.push({ name: 'example', params: { id: 1 }})
   * </script>
   * ```
   *
   * @param config параметры роута
   */
  push: (config: Params) => Promise<void | NavigationFailure | undefined>;

  /**
   * Вызов метода router.replace
   * ---------------------------
   *
   * Работа метода аналогична push, только он вызывает router.replace
   *
   * @see push
   * @param config конфигурация роута
   */
  replace: (config: Params) => Promise<void | NavigationFailure | undefined>;

  /**
   * Возвращает объект типа RouteLocationNamedRaw с заданными параметрами роута
   * --------------------------------------------------------------------------
   *
   * Возвращенный объект можно использовать в router-link навигации
   *
   * ```typescript
   * <script setup>
   *   const exampleRoute = routeFactory('example', {
   *     params: {
   *       id: z.number()
   *     }
   *   })
   *
   *   const toExample = exampleRoute.route({
   *     params: {id: 1}
   *   }) // -> { name: 'example', params: { id: 1 }}
   * </script>
   *
   * <template>
   *   <router-link :to="toExample"> go to example route </router-link>
   * </template>
   * ```
   *
   * @param config параметры роута
   */
  route: (config?: Params) => ComputedRef<RouteLocationRaw>;
}

export declare interface UseRouteComposition<Params> {
  /**
   * Конструктор композиции для маршрутов vue-router
   * -----------------------------------------------
   * Конструктор композиции это Callable объект который дополнительно содержит
   * методы для программной навигации, такие как push(), replace(), route()
   * Вызов конструктора как Callable Function вызовет метод push по умолчанию
   *
   * ---------------------------------
   * Использование как Callable объект
   * ---------------------------------
   * ```typescript
   * const useExampleRoute = routeCompositionFactory(<RouteRecordRaw>, {
   *   params: {
   *     id: z.string(),
   *   },
   * })
   *
   * const goExampleRoute = useExampleRoute()
   * goExampleRoute({ params: {id: 1} })
   * ```
   * ----------------------------------
   * Пример использования Push, Replace
   * ----------------------------------
   * Помимо этого в callable объекте композиции находятся отдельные методы для навигации,
   * такие как push, replace, их можно получить деструктуризацией объекта
   *
   * ```typescript
   *  const useExampleRoute = routeCompositionFactory(<RouteRecordRaw>, { // Создание композиции
   *    params: {
   *      id: z.string(),
   *    },
   *  })
   *  const { push: toExample, replace: replaceToExample } = useExampleRoute() // Вызов конструктора композиции
   *
   * toExample({ id: '1' }) // router.push({ name: 'example', params: { id: '1' } })
   * replaceToExample({ id: '1' }) // router.replace({ name: 'example', params: { id: '1' } })
   * ```
   */
  (initialParams?: MaybeRefOrGetter<Params> | ComputedRef<Params>): UseRouteCompositionReturn<Params>;

  /**
   * Необработанная запись маршрута vue-router
   * Предназначена для регистрации маршрута в роутере
   */
  raw: RouteRecordRaw;
}

type StringOrNumber = ZodType

export interface RouteParamsSchemaBuilder {
  params?: {
    [k: string]: StringOrNumber;
  };
  query?: {
    [k: string]: StringOrNumber | ZodArray<StringOrNumber>;
  };
}

type Cast<I extends Record<string, ZodType>> = {
  [k in keyof I]: z.infer<I[k]>
}
type RouteParamsSchema<P> = {
  [k in keyof P]: Cast<NonNullable<P[k]>>
}

type RoutingResult = Promise<void | NavigationFailure | undefined>
type RouterHandler<P, R = RoutingResult> = (params?: RouteParamsSchema<P>) => R

/**
 * Фабрика композиций для маршрутов vue-router
 * -------------------------------------------
 * Фабрика создает конструктор композиции UseRouteCompositionReturn
 * Конструктор композиции это Callable объект который дополнительно содержит
 * методы с __прототипированными__ аргументами для программной навигации,
 * такие как push(params), replace(params), route(params)
 *
 * Аргументы методов валидируются с помощью Zod в соответствии со схемой
 * переданной во второй аргумент фабрики {{ routeParamsSchemaBuilder }}
 *
 * Благодаря такому механизму обеспечивается самодокументирование, проверка,
 * и подсказки аргументов маршрута, таких как
 * query и params
 *
 * ```typescript
 * const useExampleRoute = routeCompositionFactory({
 *   path: '/example',
 *   component: () => import('component.vue')
 * }, {
 *   params: {
 *     id: z.string(),
 *   },
 * })
 * ```
 *
 * @param routeRecord
 * @param routeParamsSchemaBuilder
 */
export function routeCompositionFactory<P extends RouteParamsSchemaBuilder>(
  routeRecord: RouteRecordRaw,
  routeParamsSchemaBuilder?: P,
): UseRouteComposition<RouteParamsSchema<P>> {
  const name = routeRecord.name || Symbol(routeRecord.path)
  const raw = {
    ...routeRecord,
    name,
  }

  const route = (routeParams?: RouteParamsSchema<P>): RouteLocationRaw => {
    const routeDefinition: RouteLocationRaw = { name }

    // Если к маршруту не задекларированы ни Query и Params параметры
    // Будет возвращен простой RouteLocationNamedRaw без параметров
    // Все параметры, переданные в метод будут игнорироваться пока они
    // не будут задекларированы
    if (isUndefined(routeParamsSchemaBuilder) || isUndefined(routeParams))
      return routeDefinition

    if (!isUndefined(routeParams.params) && !isUndefined(routeParamsSchemaBuilder.params)) {
      routeDefinition.params = Object.entries(routeParams.params).reduce((acc, [k, v]) => {
        if (routeParamsSchemaBuilder.params?.[k])
          acc[k] = routeParamsSchemaBuilder.params[k].parse(v)

        return acc
      }, {} as Record<string, any>)
    }

    if (!isUndefined(routeParams.query) && !isUndefined(routeParamsSchemaBuilder.query)) {
      routeDefinition.query = Object.entries(routeParams.query).reduce((acc, [k, v]) => {
        if (routeParamsSchemaBuilder.query?.[k])
          acc[k] = routeParamsSchemaBuilder.query[k].parse(v)

        return acc
      }, {} as Record<string, any>)
    }

    return routeDefinition
  }

  const push = (router: Router, params?: RouteParamsSchema<P>) => {
    return router.push(route(params))
  }

  const replace = (router: Router, params?: RouteParamsSchema<P>) => {
    return router.replace(route(params))
  }

  function constructor<I extends RouteParamsSchema<P>>(
    initialParams?: MaybeRefOrGetter<I> | ComputedRef<I>,
  ) {
    const router = useRouter()

    const getParams = (params?: RouteParamsSchema<P>) => params || toValue(initialParams)
    const _pushHandler: RouterHandler<P> = params =>
      push(router, getParams(params))
    const _replaceHandler: RouterHandler<P> = params =>
      replace(router, getParams(params))
    const _buildRouteHandler: RouterHandler<P, ComputedRef<RouteLocationRaw>> = params =>
      computed(() => route(getParams(params)))

    function composition(params?: RouteParamsSchema<P>) {
      return _pushHandler(params)
    }
    composition.push = _pushHandler
    composition.replace = _replaceHandler
    composition.route = _buildRouteHandler

    return composition
  }
  constructor.raw = raw

  return constructor
}
