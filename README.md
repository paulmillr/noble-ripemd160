# noble-ripemd160

[RIPEMD160](https://en.wikipedia.org/wiki/RIPEMD), a cryptographic hash function.

### This library belongs to *noble* crypto

> **noble-crypto** — high-security, easily auditable set of contained cryptographic libraries and tools.

- No dependencies, one small file
- Easily auditable TypeScript/JS code
- Uses es2019 bigint. Supported in Chrome, Firefox, node 10+
- All releases are signed and trusted
- Check out all libraries:
  [secp256k1](https://github.com/paulmillr/noble-secp256k1),
  [ed25519](https://github.com/paulmillr/noble-ed25519),
  [bls12-381](https://github.com/paulmillr/noble-bls12-381),
  [ripemd160](https://github.com/paulmillr/noble-ripemd160),
  [secretbox-aes-gcm](https://github.com/paulmillr/noble-secretbox-aes-gcm)

## Usage

> npm install noble-ripemd160

```js
import ripemd160 from "noble-ripemd160";

const raw = ripemd160(""); // Raw string usage
// "9c1185a5c5e9fc54612808977ee8f548b2258d31"

const uint = ripemd160(new Uint8Array([97, 98, 99])); // TypedArray usage
// Uint8Array [
//   142, 178,   8, 247,
//   224,  93, 152, 122,
//   155,   4,  74, 142,
//   152, 198, 176, 135,
//   241,  90,  11, 252
// ]
// (typed array representation of "8eb208f7e05d987a9b044a8e98c6b087f15a0bfc")

```

## API

- `ripemd160(message: string): string`
- `ripemd160(message: Uint8Array): Uint8Array`
  - `message`: Message which will be hashed
  - Function output type would match the input type.


## Security

Noble is production-ready & secure. Our goal is to have it audited by a good security expert.

We're using built-in JS `BigInt`, which is "unsuitable for use in cryptography" as [per official spec](https://github.com/tc39/proposal-bigint#cryptography). This means that the lib is potentially vulnerable to [timing attacks](https://en.wikipedia.org/wiki/Timing_attack). But:

1. JIT-compiler and Garbage Collector make "constant time" extremely hard to achieve in a scripting language.
2. Which means *any other JS library doesn't use constant-time bigints*. Including bn.js or anything else. Even statically typed Rust, a language without GC, [makes it harder to achieve constant-time](https://www.chosenplaintext.ca/open-source/rust-timing-shield/security) for some cases.
3. If your goal is absolute security, don't use any JS lib — including bindings to native ones. Use low-level libraries & languages.
4. We however consider infrastructure attacks like rogue NPM modules very important; that's why it's crucial to minimize the amount of 3rd-party dependencies & native bindings. If your app uses 500 dependencies, any dep could get hacked and you'll be downloading rootkits with every `npm install`. Our goal is to minimize this attack vector.


## License

MIT (c) Paul Miller [(https://paulmillr.com)](https://paulmillr.com), see LICENSE file.
