import { Generators } from "./Generators";
import { IterUtil } from "./IterUtil";
import { PartialTypeGuard, Predicate, ToMap } from "./utils";

export interface IWrap<T> extends Iterable<T> {}

export class IWrap<T> {
    constructor(private readonly source: Iterable<T>) {
        this[Symbol.iterator] = source[Symbol.iterator];
    }

    /*************************************************************************/
    /****************************** Convertors *******************************/

    toArray() {
        return Array.from(this.source);
    }

    toMap(): ToMap<T>;
    toMap<K>(keySelector: (o: T) => K): Map<K, T>;
    toMap<K, V>(keySelector: (o: T) => K, valueSelector: (o: T) => V): Map<K, V>;
    toMap(keySelector?: (o: T) => unknown, valueSelector?: (o: T) => unknown): Map<unknown, unknown> {
        if (keySelector) {
            if (!valueSelector) valueSelector = (o) => o;
            return new Map(IterUtil.map(this.source, (o) => [keySelector(o), valueSelector!(o)] as const));
        } else {
            return new Map(this.source as unknown as Iterable<[unknown, unknown]>);
        }
    }

    toSet() {
        return new Set(this.source);
    }

    /*************************************************************************/
    /*************************** Consumer Methods ****************************/

    every(predicate: Predicate<T>): boolean {
        return IterUtil.every(this.source, predicate);
    }

    find(predicate: Predicate<T>): T | undefined {
        return IterUtil.find(this.source, predicate);
    }

    findIndex(predicate: Predicate<T>): number {
        return IterUtil.findIndex(this.source, predicate);
    }

    indexOf(searchElement: T): number {
        return IterUtil.indexOf(this.source, searchElement);
    }

    join(seperator?: string): string {
        return IterUtil.join(this.source, seperator);
    }

    reduce(accumulator: (previousValue: T, currentValue: T, currentIndex: number) => T): T;
    reduce(accumulator: (previousValue: T, currentValue: T, currentIndex: number) => T, initialValue: T): T;
    reduce<U>(accumulator: (previousValue: U, currentValue: T, currentIndex: number) => U, initialValue: U): U;
    reduce<U>(
        accumulator: (previousValue: T | U, currentValue: T | U, currentIndex: number) => T | U,
        initialValue?: T | U,
    ) {
        return arguments.length === 1
            ? IterUtil.reduce(this.source, accumulator)
            : IterUtil.reduce(this.source, accumulator, initialValue!);
    }

    some(predicate: Predicate<T>): boolean {
        return IterUtil.some(this.source, predicate);
    }

    /*************************************************************************/
    /***************************** Lazy Methods ******************************/

    concat<I extends Iterable<unknown>[]>(...sources: I) {
        return new IWrap(Generators.concat(this.source, ...sources));
    }

    filter<U extends T>(typeGuard: PartialTypeGuard<T, U>): IWrap<U>;
    filter(predicate: Predicate<T>): IWrap<T>;
    filter(predicate: Predicate<T>) {
        return new IWrap(IterUtil.filter(this.source, predicate));
    }

    map<U>(mapper: (o: T) => U): IWrap<U> {
        return new IWrap(IterUtil.map(this.source, mapper));
    }

    take(count: number): IWrap<T> {
        return new IWrap(IterUtil.takeWhile(this.source, (_, i) => i < count));
    }

    while<U extends T>(typeGuard: PartialTypeGuard<T, U>): IWrap<U>;
    while(predicate: Predicate<T>): IWrap<T>;
    while(predicate: Predicate<T>) {
        return new IWrap(IterUtil.takeWhile(this.source, predicate));
    }

    /*************************************************************************/
    /************************** Static Constructors **************************/

    static concat<I extends Iterable<unknown>[]>(...iterables: I) {
        return new IWrap(Generators.concat(...iterables));
    }

    static cycle<T>(iterable: Iterable<T>) {
        return new IWrap(Generators.cycle(iterable));
    }

    static from<T>(iterable: Iterable<T>): IWrap<T> {
        return new IWrap(iterable);
    }

    static infinity(start = 0, step = 1): IWrap<number> {
        return new IWrap(Generators.infinity(start, step));
    }

    static range(min: number, max: number, step = 1): IWrap<number> {
        return new IWrap(Generators.range(min, max, step));
    }

    static repeat<T>(o: T, count: number): IWrap<T> {
        return new IWrap(Generators.repeat(o, count));
    }
}
