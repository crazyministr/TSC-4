const { beginCell, endCell, Dictionary } = require('ton-core')

let n1 = 0n, n2 = 1n, nextTerm;

let t1 = []
const dict = Dictionary.empty(
  Dictionary.Keys.Uint(9),
  Dictionary.Values.BigUint(512)
)
dict.set(0, n1 << 256n | n2);
for (let i = 1; i < 370; i++) {
    nextTerm = n1 + n2;
    dict.set(i, (n2 << 256n) | nextTerm)

    n1 = n2;
    n2 = nextTerm;
}


// console.log('dict', dict)
console.log(beginCell().storeDictDirect(dict).endCell().toBoc().toString('base64'))
// console.log(beginCell().storeDict(dict).endCell().toBoc().toString('base64'))


function getFibN(i) {
  let tIdx = Math.floor(i  /15)
  let idx = Math.floor(i  %15)
  console.log('fib', t1[tIdx][idx])
}

// getFibN(100)
