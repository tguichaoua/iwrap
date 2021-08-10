export type IterableType<T extends Iterable<unknown>> = T extends Iterable<infer U> ? U : never;
