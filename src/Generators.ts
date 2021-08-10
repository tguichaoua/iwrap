import { IterableType } from "./utils";

/**
 * A collections of usefull generators.
 */
export class Generators extends null {
    static *concat<I extends Iterable<unknown>[]>(...iterables: I): Generator<IterableType<I[number]>> {
        for (const source of iterables) {
            for (const o of source) {
                yield o as IterableType<I[number]>;
            }
        }
    }

    static *cycle<T>(iterable: Iterable<T>) {
        while (true) for (const o of iterable) yield o;
    }

    static *infinity(start: number, step: number) {
        while (true) {
            yield start;
            start += step;
        }
    }

    static *range(start: number, end: number, step: number) {
        if (step > 0) for (let i = start; i < end; i += step) yield i;
        else for (let i = start; i > end; i += step) yield i;
    }

    static *repeat<T>(o: T, count: number) {
        for (; count > 0; --count) yield o;
    }
}
