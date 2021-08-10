import { Predicate, TypedPredicate } from "./utils";

/**
 * A collection of utility methods for `Iterable` like `Array.filter`, `Array.map`, etc.
 */
export class IterUtil extends null {
    /**
     * Determines whether all the members of an iterable satisfy the specified test.
     * @param source
     * @param predicate A function that accepts up to two arguments. The every method calls
     * the predicate function for each element in the iterable until the predicate returns a value
     * which is coercible to the Boolean value false, or until the end of the iterable.
     * @see {@link Array.every}
     */
    static every<T>(source: Iterable<T>, predicate: Predicate<T>): boolean {
        let i = 0;
        for (const o of source) if (!predicate(o, i++)) return false;
        return true;
    }

    /**
     * Returns a generator on the elements of an iterable that meet the condition specified in a callback function.
     * @param source
     * @param predicate A function that accepts up to two arguments. The filter method calls the predicate function
     * one time for each element in the iterable.
     * @see {@link Array.filter}
     */
    static *filter<T, U extends T>(source: Iterable<T>, predicate: TypedPredicate<T, U>) {
        let i = 0;
        for (const o of source) if (predicate(o, i++)) yield o;
    }

    /**
     * Returns the value of the first element in the iterable where predicate is true, and undefined
     * otherwise.
     * @param source
     * @param predicate find calls predicate once for each element of the iterable until it finds
     * one where predicate returns true. If such an element is found, find
     * immediately returns that element value. Otherwise, find returns undefined.
     * @see {@link Array.find}
     */
    static find<T, U extends T>(source: Iterable<T>, predicate: TypedPredicate<T, U>): U | undefined {
        let i = 0;
        for (const o of source) if (predicate(o, i++)) return o;
        return undefined;
    }

    /**
     * Returns the index of the first element in the iterable where predicate is true, and -1
     * otherwise.
     * @param source
     * @param predicate find calls predicate once for each element of the iterable until it finds
     * one where predicate returns true. If such an element is found,
     * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
     * @see {@link Array.findIndex}
     */
    static findIndex<T>(source: Iterable<T>, predicate: Predicate<T>): number {
        let i = 0;
        for (const o of source) if (predicate(o, i++)) return i;
        return -1;
    }

    /**
     * Returns the index of the first occurrence of a value in an iterable, or -1 if it is not present.
     * @param source
     * @param searchElement The value to locate.
     * @see {@link Array.indexOf}
     */
    static indexOf<T>(source: Iterable<T>, searchElement: T): number {
        return IterUtil.findIndex(source, (o) => o === searchElement);
    }

    /**
     * Adds all the elements of an iterable into a string, separated by the specified separator string.
     * @param source
     * @param separator A string used to separate one element of the iterable from the next in the resulting string.
     * If omitted, the iterable elements are separated with a comma.
     * @see {@link Array.join}
     */
    static join(source: Iterable<unknown>, separator = ","): string {
        const iter = source[Symbol.iterator]();
        let current = iter.next();
        if (current.done) return "";
        let s = `${current.value}`;
        while (!(current = iter.next()).done) s += `${separator}${current.value}`;
        return s;
    }

    /**
     * Calls a defined callback function on each element of an iterable,
     * and returns an generator on the results.
     * @param source
     * @param mapper A function that accepts up to two arguments. The map method calls the mapper
     * function one time for each element in the iterable.
     * @see {@link Array.map}
     */
    static *map<T, U>(source: Iterable<T>, mapper: (o: T) => U): Generator<U, void, unknown> {
        for (const o of source) yield mapper(o);
    }

    /**
     * Calls the specified accumulator function for all the elements in an iterable.
     * The return value of the accumulator function is the accumulated result, and is provided as an argument
     * in the next call to the accumulator function.
     * @param source
     * @param accumulator A function that accepts up to three arguments. The reduce method calls the accumulator function one time
     *  for each element in the iterable.
     * @see {@link Array.reduce}
     */
    static reduce<T>(
        source: Iterable<T>,
        accumulator: (previousValue: T, currentValue: T, currentIndex: number) => T,
    ): T;
    /**
     * Calls the specified accumulator function for all the elements in an iterable.
     * The return value of the accumulator function is the accumulated result, and is provided as an argument
     * in the next call to the accumulator function.
     * @param source
     * @param accumulator A function that accepts up to three arguments. The reduce method calls the accumulator function one time
     *  for each element in the iterable.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation.
     * The first call to the accumulator function provides this value as an argument instead of an iterable value.
     * @see {@link Array.reduce}
     */
    static reduce<T>(
        source: Iterable<T>,
        accumulator: (previousValue: T, currentValue: T, currentIndex: number) => T,
        initialValue: T,
    ): T;
    /**
     * Calls the specified accumulator function for all the elements in an iterable.
     * The return value of the accumulator function is the accumulated result, and is provided as an argument
     * in the next call to the accumulator function.
     * @param source
     * @param accumulator A function that accepts up to three arguments. The reduce method calls the accumulator function one time
     *  for each element in the iterable.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation.
     * The first call to the accumulator function provides this value as an argument instead of an iterable value.
     * @see {@link Array.reduce}
     */
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

    /**
     * Determines whether the specified callback function returns true for any element of an iterable.
     * @param source
     * @param predicate A function that accepts up to two arguments. The some method calls
     * the predicate function for each element in the iterable until the predicate returns a value
     * which is coercible to the Boolean value true, or until the end of the iterable.
     * @see {@link Array.some}
     */
    static some<T>(source: Iterable<T>, predicate: Predicate<T>): boolean {
        let i = 0;
        for (const o of source) if (predicate(o, i++)) return true;
        return false;
    }

    /**
     * Similar to {@link IterUtil.filter} but stop iterate after `predicate` return `false`.
     * @param source
     * @param predicate A function that accepts up to two arguments. The takeWhile method calls the predicate function
     * one time for each element in the iterable until the predicate returns a value which is coercible to the Boolean
     * value true, or until the end of the iterable.
     */
    static *takeWhile<T, U extends T>(
        source: Iterable<T>,
        predicate: TypedPredicate<T, U>,
    ): Generator<U, void, unknown> {
        let i = 0;
        for (const o of source) {
            if (predicate(o, i++)) yield o;
            else break;
        }
    }
}
