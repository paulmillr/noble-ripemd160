const ripe = require('.').default;
let bytes = new Uint8Array(10 * 1024 * 1024);
let st = Date.now();
ripe(bytes);
console.log('10MB hashed in', Date.now() - st, 'ms');

bytes = new Uint8Array(100 * 1024 * 1024);
st = Date.now();
ripe(bytes);
console.log('100MB hashed in', Date.now() - st, 'ms');

// bytes = new Uint8Array(1024 * 1024 * 1024);
// st = Date.now();
// ripe(bytes);
// console.log('1000MB hashed in', Date.now() - st, 'ms');
