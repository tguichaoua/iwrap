export type PartialTypeGuard<T, U extends T> = (o: T) => o is U;
export type TypeGuard<T> = PartialTypeGuard<unknown, T>;
export type Predicate<T> = (o: T, index: number) => boolean;

export type ToMap<T> = T extends readonly [infer K, infer V] ? Map<K, V> : never;

export type IterableType<T extends Iterable<unknown>> = T extends Iterable<infer U> ? U : never;
