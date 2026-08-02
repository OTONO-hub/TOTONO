import { unstable_cache } from "next/cache";

import type { CacheTag } from "./cache-tags";

type CacheOptions = {
  tags: CacheTag[];
  revalidate?: number;
};

/**
 * Next.jsのunstable_cacheを
 * 共通化するラッパーです。
 */
export function createCachedFunction<
  TArgs extends unknown[],
  TResult,
>(
  cacheKey: string,
  fn: (...args: TArgs) => Promise<TResult>,
  options: CacheOptions
) {
  return unstable_cache(
    fn,
    [cacheKey],
    {
      tags: options.tags,
      revalidate:
        options.revalidate ?? 300,
    }
  );
}
