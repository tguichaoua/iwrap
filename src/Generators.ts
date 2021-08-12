import { IterableType } from "./utils";

/**
 * A collections of usefull generators.
 */
export class Generators extends null {
    /**
     * Concats the iterables.
     * @param iterables Iterables to concat.
     */
    static *concat<I extends Iterable<unknown>[]>(...iterables: I): Generator<IterableType<I[number]>> {
        for (const source of iterables) {
            for (const o of source) {
                yield o as IterableType<I[number]>;
            }
        }
    }

    /**
     * Iterates cyclically on the iterable.
     * @param iterable Iterable to iterate on.
     */
    static *cycle<T>(iterable: Iterable<T>) {
        while (true) for (const o of iterable) yield o;
    }

    /**
     * Generates endlessly number from `start` (included).
     * @param start
     * @param step
     */
    static *infinity(start: number, step: number) {
        while (true) {
            yield start;
            start += step;
        }
    }

    /**
     * Generates number from `start` (included) to `end` (excluded).
     * @param start
     * @param end
     * @param step
     */
    static *range(start: number, end: number, step: number) {
        if (step > 0) for (let i = start; i < end; i += step) yield i;
        else for (let i = start; i > end; i += step) yield i;
    }

    /**
     * Repeats the value `count` time.
     * @param value The value to repeat.
     * @param count The number of time to repeat the value.
     */
    static *repeat<T>(value: T, count: number) {
        for (; count > 0; --count) yield value;
    }

    /**
     * Zips same range elements from iterables into a tuple.
     *
     * Similar to {@link https://www.w3schools.com/python/ref_func_zip.asp Python zip}
     * @param iterables Iterables to zip.
     */
    static *zip<I extends Iterable<unknown>[]>(...iterables: I): Generator<ZipResult<I>, void, unknown> {
        const iters = iterables.map((i) => i[Symbol.iterator]());

        while (true) {
            const values = [];
            for (const i of iters) {
                const res = i.next();
                if (res.done) return;
                values.push(res.value);
            }

            yield values as unknown as ZipResult<I>;
        }
    }
}

type ZipResult<I extends Iterable<unknown>[]> = {
    [K in keyof I]: I[K] extends Iterable<infer U> ? U : never;
};
