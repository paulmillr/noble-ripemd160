/*! noble-ripemd160 - MIT License (c) Paul Miller (paulmillr.com) */
// https://homes.esat.kuleuven.be/~bosselae/ripemd160.html
// https://homes.esat.kuleuven.be/~bosselae/ripemd160/pdf/AB-9601/AB-9601.pdf

// prettier-ignore
const rl = Uint8Array.from([
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
  3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
  1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
  4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
]);

// prettier-ignore
const rr = Uint8Array.from([
  5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
  6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
  15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
  8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
  12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
]);

// prettier-ignore
const sl = Uint8Array.from([
  11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
  7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
  11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
  11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
  9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
]);

// prettier-ignore
const sr = Uint8Array.from([
  8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
  9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
  9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
  15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
  8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
]);

const Kl = Uint32Array.from([0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e]);
const Kr = Uint32Array.from([0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000]);

function rotl(x: number, n: number): number {
  return (x << n) | (x >>> (32 - n));
}

// It's called f() in spec.
function f(group: number, x: number, y: number, z: number): number {
  if (group === 0) return x ^ y ^ z;
  else if (group === 1) return (x & y) | (~x & z);
  else if (group === 2) return (x | ~y) ^ z;
  else if (group === 3) return (x & z) | (y & ~z);
  else return x ^ (y | ~z);
}

export class RIPEMD160 {
  private h0 = 0x67452301 | 0;
  private h1 = 0xefcdab89 | 0;
  private h2 = 0x98badcfe | 0;
  private h3 = 0x10325476 | 0;
  private h4 = 0xc3d2e1f0 | 0;
  private block = new Uint8Array(64);
  private blockSize = 64;
  private offset = 0;
  private length = new Uint32Array(4);
  private finalized = false;
  private view: DataView;

  constructor() {
    this.view = new DataView(this.block.buffer);
  }

  update(data: Uint8Array) {
    if (this.finalized) throw new Error('Digest already called');

    // consume data
    const block = this.block;
    let offset = 0;
    while (this.offset + data.length - offset >= this.blockSize) {
      for (let i = this.offset; i < this.blockSize; ) block[i++] = data[offset++];
      this.compress();
      this.offset = 0;
    }
    while (offset < data.length) block[this.offset++] = data[offset++];

    // update length
    for (let j = 0, carry = data.length * 8; carry > 0; j++) {
      let len = this.length[j];
      len += carry;
      carry = (len / 0x0100000000) | 0;
      if (carry > 0) len -= 0x0100000000 * carry;
      this.length[j] = len;
    }

    return this;
  }

  private compress() {
    const wordBlocks = new Uint32Array(16);
    for (let i = 0; i < 16; i++) {
      wordBlocks[i] = this.view.getInt32(i * 4, true);
    }

    // prettier-ignore
    let al = this.h0 | 0, ar = al,
        bl = this.h1 | 0, br = bl,
        cl = this.h2 | 0, cr = cl,
        dl = this.h3 | 0, dr = dl,
        el = this.h4 | 0, er = el;

    // Instead of iterating 0 to 80, we split it into 5 groups
    // And use the groups in constants, functions, etc. Much simpler
    for (let group = 0; group < 5; group++) {
      const rGroup = 4 - group;
      const hbl = Kl[group];
      const hbr = Kr[group];
      for (let i = 0; i < 16; i++) {
        const j = 16 * group + i;
        const tl = (rotl(al + f(group, bl, cl, dl) + wordBlocks[rl[j]] + hbl, sl[j]) + el) | 0;
        al = el, el = dl, dl = rotl(cl, 10) | 0, cl = bl, bl = tl; // prettier-ignore
      }
      // 2 loops are 10% faster
      for (let i = 0; i < 16; i++) {
        const j = 16 * group + i;
        const tr = (rotl(ar + f(rGroup, br, cr, dr) + wordBlocks[rr[j]] + hbr, sr[j]) + er) | 0;
        ar = er, er = dr, dr = rotl(cr, 10) | 0, cr = br, br = tr; // prettier-ignore
      }
    }

    // update state
    const t = (this.h1 + cl + dr) | 0;
    this.h1 = (this.h2 + dl + er) | 0;
    this.h2 = (this.h3 + el + ar) | 0;
    this.h3 = (this.h4 + al + br) | 0;
    this.h4 = (this.h0 + bl + cr) | 0;
    this.h0 = t;
  }

  digest(): Uint8Array {
    if (this.finalized) throw new Error('Digest already called');
    this.finalized = true;

    // create padding and handle blocks
    this.block[this.offset++] = 0x80;
    if (this.offset > 56) {
      this.block.fill(0, this.offset, 64);
      this.compress();
      this.offset = 0;
    }

    this.block.fill(0, this.offset, 56);
    this.view.setUint32(56, this.length[0], true);
    this.view.setUint32(60, this.length[1], true);
    this.compress();

    // produce result
    const res = new DataView(new ArrayBuffer(20));
    res.setInt32(0, this.h0, true);
    res.setInt32(4, this.h1, true);
    res.setInt32(8, this.h2, true);
    res.setInt32(12, this.h3, true);
    res.setInt32(16, this.h4, true);

    // reset state
    this.block.fill(0);
    this.offset = 0;
    for (let i = 0; i < 4; i++) {
      this.length[i] = 0;
    }

    return new Uint8Array(res.buffer);
  }
}

function toHex(uint8a: Uint8Array): string {
  return Array.from(uint8a)
    .map((c) => c.toString(16).padStart(2, '0'))
    .join('');
}

function utf8ToBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

export default function ripemd160(message: Uint8Array): Uint8Array;
export default function ripemd160(message: string): string;
export default function ripemd160(message: string | Uint8Array): string | Uint8Array {
  const hasher = new RIPEMD160();
  hasher.update(message instanceof Uint8Array ? message : utf8ToBytes(message));
  const hash = hasher.digest();
  return typeof message === 'string' ? toHex(hash) : hash;
}
