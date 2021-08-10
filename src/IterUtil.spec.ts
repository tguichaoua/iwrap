import { expect } from "chai";
import { IterUtil } from "./IterUtil";

describe("IterUtil", () => {
    describe("every", () => {
        it("Returns true on empty iterable", () => expect(IterUtil.every([], () => true)).to.be.true);
    });

    describe("filter", () => {
        const predicate = (o: number) => o % 2 === 0;
        const source = new Array(10).fill(null).map((_, i) => i);

        it("Behave like `Array.filter`", () =>
            expect(Array.from(IterUtil.filter(source, predicate))).to.be.deep.equals(source.filter(predicate)));
    });

    describe("join", () => {
        const source = new Array(10).fill(null).map((_, i) => i);

        it("Behave like `Array.join()`", () => expect(IterUtil.join(source)).to.be.deep.equals(source.join()));
        it("Behave like `Array.join('')`", () => expect(IterUtil.join(source, "")).to.be.deep.equals(source.join("")));
        it("Behave like `Array.join('-')`", () =>
            expect(IterUtil.join(source, "-")).to.be.deep.equals(source.join("-")));

        it("Behave like `Array.join()` on empty array", () => expect(IterUtil.join([])).to.be.deep.equals([].join()));
        it("Behave like `Array.join('')` on empty array", () =>
            expect(IterUtil.join([], "")).to.be.deep.equals([].join("")));
        it("Behave like `Array.join('-')` on empty array", () =>
            expect(IterUtil.join([], "-")).to.be.deep.equals([].join("-")));
    });

    describe("map", () => {
        const operation = (o: number) => o * 2;
        const source = new Array(10).fill(null).map((_, i) => i);

        it("Behave like `Array.map`", () =>
            expect(Array.from(IterUtil.map(source, operation))).to.be.deep.equals(source.map(operation)));
    });

    describe("reduce", () => {
        const operation = (previous: number, current: number) => previous + current;
        const source = new Array(10).fill(null).map((_, i) => i);

        it("Behave like `Array.reduce`", () =>
            expect(IterUtil.reduce(source, operation)).to.be.equals(source.reduce(operation)));
    });

    describe("some", () => {
        it("Returns false on empty iterable", () => expect(IterUtil.some([], () => true)).to.be.false);
    });

    describe("takeWhile", () => {
        const source = new Array(10).fill(null).map((_, i) => i);

        it("Don't execute the callback after one return false", () => {
            const result = IterUtil.takeWhile(source, (o: number) => {
                if (o < 3) return true;
                if (o === 3) return false;
                throw new Error("Should not execute");
            });
            expect(Array.from(result)).to.be.deep.equals([0, 1, 2]);
        });
    });
});
