/*! noble-ripemd160 - MIT License (c) Paul Miller (paulmillr.com) */
export declare class RIPEMD160 {
    private h0;
    private h1;
    private h2;
    private h3;
    private h4;
    private block;
    private blockSize;
    private offset;
    private length;
    private finalized;
    private view;
    constructor();
    update(data: Uint8Array): this;
    private compress;
    digest(): Uint8Array;
}
export default function ripemd160(message: Uint8Array): Uint8Array;
export default function ripemd160(message: string): string;
