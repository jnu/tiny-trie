tiny-trie
===

A Succinct Trie for Javascript

## About

Implementation of tiny trie by Steve Hanov and released to the public domain.
See [his blog post](http://stevehanov.ca/blog/index.php?id=120) for more info.

Code modularized and otheriwse modernized by Joe Nudell in 2015.

### From [original docs](http://www.hanovsolutions.com/trie/Bits.js)

This repo contains functions for creating a succinctly encoded trie structure
from a list of words. The trie is encoded to a succinct bit string using the
method of Jacobson (1989). The bitstring is then encoded using BASE-64.

The resulting trie does not have to be decoded to be used. This file also
contains functions for looking up a word in the BASE-64 encoded data, in
`O(mlogn)` time, where m is the number of letters in the target word, and n is
the number of nodes in the trie.

Objects for encoding:

```
TrieNode
Trie
BitWriter
```

Objects for decoding:

```
BitString
FrozenTrieNode
FrozenTrie
```

#### QUICK USAGE:

Suppose we let data be some output of the demo encoder:
```js

var data = {
  "nodeCount": 37,
  "directory": "BMIg",
  "trie": "v2qqqqqqqpIUn4A5JZyBZ4ggCKh55ZZgBA5ZZd5vIEl1wx8g8A"
};

var frozenTrie = new FrozenTrie( Data.trie, Data.directory, Data.nodeCount);

alert( frozenTrie.lookup( "hello" ) ); // outputs true
alert( frozenTrie.lookup( "kwijibo" ) ); // outputs false
```

## TODO

* Make encoding width customizable, support for full ASCII band.

* Char tables other than ASCII?

* Tests
