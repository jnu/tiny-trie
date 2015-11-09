tiny-trie
===

Trie / DAWG implementation for JavaScript.

[![Build Status](https://travis-ci.org/jnu/tiny-trie.svg?branch=master)](https://travis-ci.org/jnu/tiny-trie)

## About

Construct a trie out of a list of words for efficient searches. The trie
provides a `#freeze` method to dedupe its suffixes, turning it into a DAWG.

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
```

## Benchmarks

Quick benchmarks with the initial implementation on an MBP, node v5.0.0.

Gives an idea roughly how long things take.

```
// words.txt = scrabble dictionary with 178,692 words. Chars A-Z

> var trie = TinyTrie.createSync(words);
// 846 milliseconds

> trie.test(...);
// avg: 0.05 milliseconds

> trie.freeze();
// 124 seconds

> trie.encode();
// 936 milliseconds
```

The init time of almost 1s is not acceptable for a client-side application.
The goal of running `Trie#freeze(); Trie#encode();` at build time is to
produce a blob version of the DAWG that has virtually *no* init time - the
blob can be queried directly, with speeds approaching the full `Trie`'s very
fast 50 microsecond times.

## TODO

* Finish `Trie#encode` implementation

* Implement `ClientTrie`

This will enable something like:

```js
// encode the trie for distribution
let encoded = trie.encode();

// use the encoded trie in an application
import {ClientTrie} from 'tiny-trie';

let trie = ClientTrie.load(encoded);

trie.test('spit');
// -> true
```
