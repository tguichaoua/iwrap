export type PartialTypeGuard<T, U extends T> = (o: T, index: number) => o is U;
export type Predicate<T> = (o: T, index: number) => boolean;
export type TypedPredicate<T, U extends T> = PartialTypeGuard<T, U> | Predicate<T>;
