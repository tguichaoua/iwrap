import { expect } from "chai";
import { Generators } from "./Generators";

describe("Generators", () => {
    describe("concat", () => {
        it("Concat iterables", () => {
            const generator = Generators.concat([0, 1], [2, 3, 4, 5], [6, 7]);
            const array = Array.from(generator);
            expect(array).to.be.deep.equals([0, 1, 2, 3, 4, 5, 6, 7]);
        });
    });

    describe("cycle", () => {
        it("Cycle throw the iterable", () => {
            const generator = Generators.cycle([0, 1, 2]);
            let i = 0;
            for (const o of generator) {
                expect(o).to.be.equals(i % 3);
                if (++i > 100) break;
            }
        });
    });

    describe("infinity", () => {
        function test(title: string, start: number, step: number) {
            it(title, () => {
                const generator = Generators.infinity(start, step);
                let i = start;
                let j = 0;
                for (const o of generator) {
                    expect(o).to.be.equals(i);
                    i += step;
                    if (++j > 100) break;
                }
            });
        }
        test("Go foward with integer", 0, 1);
        test("Go foward with decimal", 5, 0.1);
        test("Go backward with integer", 100, -3);
        test("Go backward with decimal", 100, -0.7);
    });

    describe("range", () => {
        it("Generate an array with integer, start include, end exclude", () =>
            expect(Array.from(Generators.range(0, 10, 1))).to.be.deep.equals([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));

        it("Generate an array with decimal, start include, end exclude", () =>
            expect(Array.from(Generators.range(0, 1, 0.2))).to.be.deep.equals([0, 0.2, 0.4, 0.6000000000000001, 0.8])); // FIXME: deep equals with decimal

        it("Can handle negatif step", () =>
            expect(Array.from(Generators.range(5, 2, -1))).to.be.deep.equals([5, 4, 3]));

        it("Returns empty array if start if greater than end and step is positif", () =>
            expect(Array.from(Generators.range(5, 2, 1))).to.be.deep.equals([]));

        it("Returns empty array if start if lower than end and step is negatif", () =>
            expect(Array.from(Generators.range(2, 8, -0.3))).to.be.deep.equals([]));
    });

    describe("repeat", () => {
        it("Repeat the value", () => {
            expect(Array.from(Generators.repeat("Foo", 5))).to.be.deep.equals(["Foo", "Foo", "Foo", "Foo", "Foo"]);
            expect(Array.from(Generators.repeat("Bar", 2))).to.be.deep.equals(["Bar", "Bar"]);
        });
        it("Returns an empty array if count is 0", () =>
            expect(Array.from(Generators.repeat("Goo", 0))).to.be.deep.equals([]));
        it("Returns an empty array if count is negatif", () =>
            expect(Array.from(Generators.repeat("Baz", -3))).to.be.deep.equals([]));
    });
});
