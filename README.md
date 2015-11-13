tiny-trie
===

Trie / DAWG implementation for JavaScript.

[![Build Status](https://travis-ci.org/jnu/tiny-trie.svg?branch=master)](https://travis-ci.org/jnu/tiny-trie)

## About

Construct a trie out of a list of words for efficient searches. The trie
provides a `#freeze` method to dedupe its suffixes, turning it into a directed
acyclic word graph (DAWG).

More excitingly, there is a `Trie#encode` method which outputs the trie in a
succinct binary format. (The trie does not need to be DAWG-ified in order to
encode it, but it usually makes sense to do so.) The binary format is output in
Base-64 and can be transmitted as JSON.

To use an encoded trie, there is a `PackedTrie` class. This class can make
queries against the trie without ever having to parse the binary file. This
class has virtually no initialization cost and low memory overhead without
sacrificing lookup speed.

There are no specific character or size constraints on the Trie input. Unicode
input should work, provided you treat the encoded string as unicode (it will
contain the unicode characters somewhere in it.)

## Usage

```js
let words = ['spit', 'spat', 'spot', 'spits', 'spats', 'spots'];

let trie = new Trie();

words.forEach(word => trie.insert(word));

// test membership
trie.test('spit');
// -> true
trie.test('split');
// -> false

// finalize the trie, turning it into a DAWG
trie.freeze();

// encode the trie
let encoded = trie.encode();
// -> 'A4AAAAMEspiaotI0NmhqfPzcsQLwwrCCcBAQE'

// This string describes the DAWG in a concise binary format. This format can
// be interpreted by the `PackedTrie` class.
let smallDawg = new PackedTrie(encoded);

smallDawg.test('spit');
// -> true
smallDawg.test('split');
// -> false
```

### Including in a project

#### Installed in `node_modules`:
```js
import {TinyTrie} from 'tiny-trie';
import PackedTrie from 'tiny-trie/lib/PackedTrie';
```

The default module export also provides some convenience functional tools:

```js
import tinyTrie from 'tiny-trie';

tinyTrie.createSync(['foo', 'bar']);
// equivalent to:
//  > var t = new Trie();
//  > ['foo', 'bar'].forEach(word => t.insert(word));

tinyTrie.createFrozenSync(['foo', 'bar']);
// equivalent to:
//  > var t = new Trie();
//  > ['foo', 'bar'].forEach(word => t.insert(word));
//  > t.freeze();
```

#### Standalone files
Bundled, ES5-compatible equivalents to the above are in `./dist`.

```js
// tiny-trie[.min].js
TinyTrie.Trie
TinyTrie.createSync
TinyTrie.createFrozenSync

// packed-trie[.min].js
PackedTrie
```

## Benchmarks

Quick benchmarks with the initial implementation on an MBP, node v5.0.0.

Using `dictionary.txt`, a Scrabble dictionary with 178,692 words.

```js
var words = fs.readFileSync('./dictionary.txt', 'utf8').split('\n');
```

### Speed

Gives an idea roughly how long things take.

```js
> var trie = TinyTrie.createSync(words);
// 846 milliseconds

> trie.test(...);
// avg: 0.05 milliseconds

> trie.freeze();
// 124 seconds

> var encoded = trie.encode();
// 936 milliseconds

> var packed = new PackedTrie(encoded);
// 0.06 milliseconds (compare `new Set(words)`, which takes about 1s)

> packed.test(...);
// avg: 0.05 milliseconds (not significantly different from the unpacked trie!)
```

The init time of almost 1s is not acceptable for a client-side application.
The goal of running `Trie#freeze(); Trie#encode();` at build time is to
produce a packed version of the DAWG that has virtually *no* init time - and it
can still be queried directly, with speeds approaching the full `Trie`'s very
fast 50 microsecond times.

### Memory

```js
> words.join('').length
// 1584476 (bytes)

> encoded.length
// 698518 (bytes)

> encoded.length / words.join('').length
// 0.44085110787414894
```

The encoded trie uses just 44% of the bytes as the full dictionary. Gzipping
gives a trie of 483kb, compared with 616kb for the dictionary.

## TODO

* Real benchmarks, comparison with other implementations

* Optimize in `PackedTrie` - reduce size, increase perf. Node order could
probably be revised to shrink pointer field width.

* Fuzzy-matching

* Spec out limitations on encoding inputs
