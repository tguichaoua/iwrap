import { PartialTypeGuard, Predicate } from "./utils";

/**
 * A collection of utility methods for `Iterable` like `Array.filter`, `Array.map`, etc.
 */
export class IterUtil extends null {
    static every<T>(source: Iterable<T>, predicate: Predicate<T>): boolean {
        let i = 0;
        for (const o of source) if (!predicate(o, i++)) return false;
        return true;
    }

    static *filter<T, U extends T>(
        source: Iterable<T>,
        predicate: PartialTypeGuard<T, U> | Predicate<T>,
    ): Generator<U, void, unknown> {
        let i = 0;
        for (const o of source) if (predicate(o, i++)) yield o;
    }

    static find<T>(source: Iterable<T>, predicate: Predicate<T>): T | undefined {
        let i = 0;
        for (const o of source) if (predicate(o, i++)) return o;
        return undefined;
    }

    static findIndex<T>(source: Iterable<T>, predicate: Predicate<T>): number {
        let i = 0;
        for (const o of source) if (predicate(o, i++)) return i;
        return -1;
    }

    static indexOf<T>(source: Iterable<T>, searchElement: T): number {
        return IterUtil.findIndex(source, (o) => o === searchElement);
    }

    static join(source: Iterable<unknown>, separator: string = ","): string {
        const iter = source[Symbol.iterator]();
        let current = iter.next();
        if (current.done) return "";
        let s = `${current.value}`;
        while (!(current = iter.next()).done) s += `${separator}${current.value}`;
        return s;
    }

    static *map<T, U>(source: Iterable<T>, mapper: (o: T) => U): Generator<U, void, unknown> {
        for (const o of source) yield mapper(o);
    }

    static reduce<T>(
        source: Iterable<T>,
        accumulator: (previousValue: T, currentValue: T, currentIndex: number) => T,
    ): T;
    static reduce<T>(
        source: Iterable<T>,
        accumulator: (previousValue: T, currentValue: T, currentIndex: number) => T,
        initialValue: T,
    ): T;
    static reduce<T, U>(
        source: Iterable<T>,
        accumulator: (previousValue: U, currentValue: T, currentIndex: number) => U,
        initialValue: U,
    ): U;
    static reduce(
        source: Iterable<unknown>,
        accumulator: (previousValue: unknown, currentValue: unknown, currentIndex: number) => unknown,
        initialValue?: unknown,
    ) {
        let value: unknown;
        const iter = source[Symbol.iterator]();

        if (arguments.length >= 3) {
            value = initialValue;
        } else {
            const first = iter.next();
            if (first.done) throw new TypeError("Reduce of empty iterable with no initial value");
            else value = first.value;
        }

        let current;
        let i = 0;
        while (!(current = iter.next()).done) {
            value = accumulator(value, current.value, ++i);
        }

        return value;
    }

    static some<T>(source: Iterable<T>, predicate: Predicate<T>): boolean {
        let i = 0;
        for (const o of source) if (predicate(o, i++)) return true;
        return false;
    }

    static *takeWhile<T, U extends T>(
        source: Iterable<T>,
        predicate: PartialTypeGuard<T, U> | Predicate<T>,
    ): Generator<U, void, unknown> {
        let i = 0;
        for (const o of source) {
            if (predicate(o, i++)) yield o;
            else break;
        }
    }
}
