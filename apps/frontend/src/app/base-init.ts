export async function baseInit(...awaitable: Promise<any>[]) {
  await Promise.all(awaitable)
}
