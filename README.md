<h1 align="center">Iterable Wrapper</h1>
<p align="center">
    <a href="https://www.npmjs.com/package/iwrap" target="_blank">
        <img alt="Version" src="https://img.shields.io/npm/v/iwrap.svg">
    </a>
     <a href="https://github.com/tguichaoua/iwrap/blob/main/LICENSE" target="_blank">
        <img alt="License: MIT" src="https://img.shields.io/github/license/tguichaoua/iwrap" />
    </a>
</p>

> A wrapper around Iterable to bring access to powerful methods similar to `filter`, `map`, etc ...

## Install

Install by running this command:

```sh
npm i iwrap
```

## How to use

```ts
import { IWrap } from ".";

const scores = new Map([
    ["Alice", 500],
    ["Bob", 356],
    ["Charles", 42],
    ["David", 999],
]);

// Output wanted:
// Alice.........................500
// Bob...........................356
// Charles.......................42
// David.........................999

// Without IWrap
const display1 = Array.from(scores) //from: scores is iterated and a array is created.
    // map: previous array is iterated and a new array is created.
    .map(([name, score]) => `${name}${".".repeat(30 - name.length)}${score}`)
    // join: previous array is iterated and return a string.
    .join("\n");
// Result: 3 iterations
console.log(display1);

// With IWrap
const display2 = IWrap.from(scores) // from: creates a wrapper around scores.
    // map: a new wrapper is created around the prevous one.
    .map(([name, score]) => `${name}${".".repeat(30 - name.length)}${score}`)
    // join: iterate the previous wrapper and return a string.
    .join("\n");
// Result: 1 iteration
console.log(display2);
```

## Author

👤 **Tristan Guichaoua**

-   Github: [@tguichaoua](https://github.com/tguichaoua)

## 📝 License

Copyright © 2021 [Tristan Guichaoua](https://github.com/tguichaoua).<br />
This project is [MIT](https://github.com/tguichaoua/iwrap/blob/main/LICENSE) licensed.
