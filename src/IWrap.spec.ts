import { expect } from "chai";
import { IWrap } from "./IWrap";

describe("IWrap", () => {
    describe("toMap", () => {
        describe("argument-less", () => {
            it("Create a map from the IWrap", () => {
                const map = IWrap.from(["Foo", "BarBaz", "HooJooBoo"])
                    .map((s) => [s, s.length] as const)
                    .toMap();
                expect(map).to.be.a("map");
                expect(map).to.have.keys("Foo", "BarBaz", "HooJooBoo");
                expect(map.get("Foo")).to.be.equals(3);
                expect(map.get("BarBaz")).to.be.equals(6);
                expect(map.get("HooJooBoo")).to.be.equals(9);
            });
            it("Should throw `Iterator value xxx is not an entry object`", () => {
                const wrap = IWrap.from(["Foo", "BarBaz", "HooJooBoo"]);
                expect(() => wrap.toMap()).to.throws(/Iterator value \w+ is not an entry object/);
            });
        });
    });
});
