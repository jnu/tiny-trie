tiny-trie
===

Trie / DAWG implementation for JavaScript.

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

## TODO

* Implement `Trie#encode`

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
