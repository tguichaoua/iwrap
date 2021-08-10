import { Generators } from "./Generators";
import { IterUtil } from "./IterUtil";
import { Mapper, Predicate, TypedPredicate } from "./callbacks";

type ToMap<T> = T extends readonly [infer K, infer V] ? Map<K, V> : never;

//eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IWrap<T> extends Iterable<T> {}

export class IWrap<T> {
    constructor(private readonly source: Iterable<T>) {
        this[Symbol.iterator] = source[Symbol.iterator];
    }

    /*************************************************************************/
    /****************************** Convertors *******************************/

    /**
     * Creates an Array from this iterable.
     * @returns The created Array.
     */
    toArray() {
        return Array.from(this.source);
    }

    /**
     * Creates a Map from this iterable if its elements are key value tuples.
     * Raises an error otherwise.
     * @returns The created Map.
     */
    toMap(): ToMap<T>;
    /**
     * Creates a Map using `keySelector` to extract the key from the elements.
     * @param keySelector Extract the key from the element.
     * @returns The created Map.
     */
    toMap<K>(keySelector: (o: T) => K): Map<K, T>;
    /**
     * Creates a Map using `keySelector` to extract the key from the elements and
     * `valueSelector` to extract the value.
     * @param keySelector Extract the key from the element.
     * @param valueSelector Extract the value from the element.
     * @returns The created Map.
     */
    toMap<K, V>(keySelector: (o: T) => K, valueSelector: (o: T) => V): Map<K, V>;
    toMap(keySelector?: (o: T) => unknown, valueSelector?: (o: T) => unknown): Map<unknown, unknown> {
        if (keySelector) {
            if (!valueSelector) valueSelector = (o) => o;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return new Map(IterUtil.map(this.source, (o) => [keySelector(o), valueSelector!(o)] as const));
        } else {
            return new Map(this.source as unknown as Iterable<[unknown, unknown]>);
        }
    }

    /**
     * Creates a Set from this iterable.
     * @returns The created Set.
     */
    toSet() {
        return new Set(this.source);
    }

    /*************************************************************************/
    /*************************** Consumer Methods ****************************/

    /**
     * Determines whether all the members of an iterable satisfy the specified test.
     * @param predicate A function that accepts up to two arguments. The every method calls the predicate function for each element in the iterable until the predicate returns a value which is coercible to the Boolean value false, or until the end of the iterable.
     * @see {@link IterUtil.every}
     */
    every(predicate: Predicate<T>): boolean {
        return IterUtil.every(this.source, predicate);
    }

    /**
     * Returns the value of the first element in the iterable where predicate is true, and undefined otherwise.
     * @param predicate find calls predicate once for each element of the iterable until it finds one where predicate returns true. If such an element is found, find immediately returns that element value. Otherwise, find returns undefined.
     * @see {@link IterUtil.find}
     */
    find<U extends T>(predicate: TypedPredicate<T, U>): U | undefined {
        return IterUtil.find(this.source, predicate);
    }

    /**
     * Returns the index of the first element in the iterable where predicate is true, and -1 otherwise.
     * @param predicate find calls predicate once for each element of the iterable until it finds one where predicate returns true. If such an element is found, findIndex immediately returns that element index. Otherwise, findIndex returns -1.
     * @see {@link IterUtil.findIndex}
     */
    findIndex(predicate: Predicate<T>): number {
        return IterUtil.findIndex(this.source, predicate);
    }

    /**
     * Returns the index of the first occurrence of a value in an iterable, or -1 if it is not present.
     * @param searchElement The value to locate.
     * @see {@link IterUtil.indexOf}
     */
    indexOf(searchElement: T): number {
        return IterUtil.indexOf(this.source, searchElement);
    }

    /**
     * Adds all the elements of an iterable into a string, separated by the specified separator string.
     * @param seperator A string used to separate one element of the iterable from the next in the resulting string. If omitted, the iterable elements are separated with a comma.
     * @see {@link IterUtil.join}
     */
    join(seperator?: string): string {
        return IterUtil.join(this.source, seperator);
    }

    /**
     * Calls the specified accumulator function for all the elements in an iterable. The return value of the accumulator function is the accumulated result, and is provided as an argument in the next call to the accumulator function.
     * @param accumulator A function that accepts up to three arguments. The reduce method calls the accumulator function one time for each element in the iterable.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the accumulator function provides this value as an argument instead of an iterable value.
     * @see {@link IterUtil.reduce}
     */
    reduce(accumulator: (previousValue: T, currentValue: T, currentIndex: number) => T): T;
    reduce(accumulator: (previousValue: T, currentValue: T, currentIndex: number) => T, initialValue: T): T;
    reduce<U>(accumulator: (previousValue: U, currentValue: T, currentIndex: number) => U, initialValue: U): U;
    reduce<U>(
        accumulator: (previousValue: T | U, currentValue: T | U, currentIndex: number) => T | U,
        initialValue?: T | U,
    ) {
        return arguments.length === 1
            ? IterUtil.reduce(this.source, accumulator)
            : IterUtil.reduce(this.source, accumulator, initialValue!); // eslint-disable-line @typescript-eslint/no-non-null-assertion
    }

    /**
     * Determines whether the specified callback function returns true for any element of an iterable.
     * @param predicate A function that accepts up to two arguments. The some method calls the predicate function for each element in the iterable until the predicate returns a value which is coercible to the Boolean value true, or until the end of the iterable.
     * @see {@link IterUtil.some}
     */
    some(predicate: Predicate<T>): boolean {
        return IterUtil.some(this.source, predicate);
    }

    /*************************************************************************/
    /***************************** Lazy Methods ******************************/

    /**
     * Adds the iterables at the end.
     * @param iterables
     * @returns
     * @see {@link Generators.concat}
     */
    concat<I extends Iterable<unknown>[]>(...iterables: I) {
        return new IWrap(Generators.concat(this.source, ...iterables));
    }

    /**
     * Ignores elements that doesn't satisfy the predicate.
     * @param predicate
     * @returns
     * @see {@link IterUtil.filter}
     */
    filter<U extends T>(predicate: TypedPredicate<T, U>): IWrap<U> {
        return new IWrap(IterUtil.filter(this.source, predicate));
    }

    /**
     * Apply `mapper` on every elements.
     * @param mapper Called for each element.
     * @returns
     * @see {@link IterUtil.map}
     */
    map<U>(mapper: Mapper<T, U>): IWrap<U> {
        return new IWrap(IterUtil.map(this.source, mapper));
    }

    /**
     * Takes only `count` elements.
     * @param count The number of elements to take.
     * @returns
     */
    take(count: number): IWrap<T> {
        return new IWrap(IterUtil.takeWhile(this.source, (_, i) => i < count));
    }

    /**
     * Takes elements while `predicate` return `true`.
     * @param predicate
     * @returns
     */
    while<U extends T>(predicate: TypedPredicate<T, U>): IWrap<U> {
        return new IWrap(IterUtil.takeWhile(this.source, predicate));
    }

    /*************************************************************************/
    /************************** Static Constructors **************************/

    /**
     * Creates a {@link IWrap} based on {@link Generators.concat}.
     * @param iterables
     * @returns
     */
    static concat<I extends Iterable<unknown>[]>(...iterables: I) {
        return new IWrap(Generators.concat(...iterables));
    }

    /**
     * Creates a {@link IWrap} based on {@link Generators.cycle}.
     * @param iterable
     * @returns
     */
    static cycle<T>(iterable: Iterable<T>) {
        return new IWrap(Generators.cycle(iterable));
    }

    /**
     * Creates a {@link IWrap} that wrap the iterable.
     * @param iterable
     * @returns
     */
    static from<T>(iterable: Iterable<T>): IWrap<T> {
        return new IWrap(iterable);
    }

    /**
     * Creates a {@link IWrap} based on {@link Generators.infinity}.
     * @param start
     * @param step
     * @returns
     */
    static infinity(start = 0, step = 1): IWrap<number> {
        return new IWrap(Generators.infinity(start, step));
    }

    /**
     * Creates a {@link IWrap} based on {@link Generators.range}.
     * @param start
     * @param end
     * @param step
     * @returns
     */
    static range(start: number, end: number, step = 1): IWrap<number> {
        return new IWrap(Generators.range(start, end, step));
    }

    /**
     * Creates a {@link IWrap} based on {@link Generators.repeat}.
     * @param value
     * @param count
     * @returns
     */
    static repeat<T>(value: T, count: number): IWrap<T> {
        return new IWrap(Generators.repeat(value, count));
    }
}
