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
  [ripemd160](https://github.com/paulmillr/noble-ripemd160)

## API

- `ripemd160(message: string): string`
- `ripemd160(message: Uint8Array): Uint8Array`
  - `message`: Message which will be hashed
  - Function output type would match the input type.

## Usage

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

## License

MIT (c) Paul Miller (https://paulmillr.com), see LICENSE file.
