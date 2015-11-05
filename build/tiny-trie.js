(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createSync = createSync;
	exports.freeze = freeze;
	exports.freezeToJSON = freezeToJSON;
	exports.loadFrozen = loadFrozen;

	var _Trie = __webpack_require__(1);

	var _Trie2 = _interopRequireDefault(_Trie);

	var _FrozenTrie = __webpack_require__(4);

	var _FrozenTrie2 = _interopRequireDefault(_FrozenTrie);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Synchronously construct a new Trie out of the given words.
	 * @param  {String[]} words
	 * @return {Trie}
	 */
	function createSync(words) {
	  var trie = new _Trie2.default();

	  words.map(function (word) {
	    return trie.insert(word);
	  });

	  return trie;
	}

	/**
	 * Freeze a Trie
	 * @param  {Trie} trie
	 * @return {FrozenTrie}
	 */
	function freeze(trie) {
	  return _FrozenTrie2.default.freeze(trie);
	}

	/**
	 * Freeze a Trie and serialize it in one call.
	 * @param  {Trie} trie
	 * @return {Object}
	 */
	function freezeToJSON(trie) {
	  return _FrozenTrie2.default.freeze(trie).serialize();
	}

	/**
	 * Load a frozen trie from JSON
	 * @param  {Object} json
	 * @return {FrozenTrie}
	 */
	function loadFrozen(json) {
	  return _FrozenTrie2.default.deserialize(json);
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _BitWriter = __webpack_require__(2);

	var _BitWriter2 = _interopRequireDefault(_BitWriter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	  A Trie node, for use in building the encoding trie. This is not needed for
	  the decoder.
	  */

	var TrieNode = function TrieNode(letter) {
	    _classCallCheck(this, TrieNode);

	    this.letter = letter;
	    this.final = false;
	    this.children = [];
	};

	var Trie = (function () {
	    function Trie() {
	        _classCallCheck(this, Trie);

	        this.previousWord = "";
	        this.root = new TrieNode(' ');
	        this.cache = [this.root];
	        this.nodeCount = 1;
	    }

	    /**
	      Returns the number of nodes in the trie
	     */

	    _createClass(Trie, [{
	        key: 'getNodeCount',
	        value: function getNodeCount() {
	            return this.nodeCount;
	        }

	        /**
	          Inserts a word into the trie. This function is fastest if the words are
	          inserted in alphabetical order.
	         */

	    }, {
	        key: 'insert',
	        value: function insert(word) {
	            var commonPrefix = 0;
	            for (var i = 0; i < Math.min(word.length, this.previousWord.length); i++) {
	                if (word[i] !== this.previousWord[i]) {
	                    break;
	                }
	                commonPrefix += 1;
	            }

	            this.cache.length = commonPrefix + 1;
	            var node = this.cache[this.cache.length - 1];

	            for (i = commonPrefix; i < word.length; i++) {
	                var next = new TrieNode(word[i]);
	                this.nodeCount++;
	                node.children.push(next);
	                this.cache.push(next);
	                node = next;
	            }

	            node.final = true;
	            this.previousWord = word;
	        }

	        /**
	          Apply a function to each node, traversing the trie in level order.
	          */

	    }, {
	        key: 'apply',
	        value: function apply(fn) {
	            var level = [this.root];
	            while (level.length > 0) {
	                var node = level.shift();
	                for (var i = 0; i < node.children.length; i++) {
	                    level.push(node.children[i]);
	                }
	                fn(node);
	            }
	        }

	        /**
	          Encode the trie and all of its nodes. Returns a string representing the
	          encoded data.
	          */

	    }, {
	        key: 'encode',
	        value: function encode() {
	            // Write the unary encoding of the tree in level order.
	            var bits = new _BitWriter2.default();
	            bits.write(0x02, 2);
	            this.apply(function (node) {
	                for (var i = 0; i < node.children.length; i++) {
	                    bits.write(1, 1);
	                }
	                bits.write(0, 1);
	            });

	            // Write the data for each node, using 6 bits for node. 1 bit stores
	            // the "final" indicator. The other 5 bits store one of the 26 letters
	            // of the alphabet.
	            var a = "a".charCodeAt(0);
	            this.apply(function (node) {
	                var value = node.letter.charCodeAt(0) - a;
	                if (node.final) {
	                    value |= 0x20;
	                }

	                bits.write(value, 6);
	            });

	            return bits.getData();
	        }
	    }]);

	    return Trie;
	})();

	exports.default = Trie;
	;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           The BitWriter will create a stream of bytes, letting you write a certain
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           number of bits at a time. This is part of the encoder, so it is not
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           optimized for memory or speed.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       */

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _constants = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	    Returns the character unit that represents the given value. If this were
	    binary data, we would simply return id.
	 */
	function CHR(id) {
	    return _constants.BASE64[id];
	}

	var BitWriter = (function () {
	    function BitWriter() {
	        _classCallCheck(this, BitWriter);

	        this.bits = [];
	    }

	    /**
	        Write some data to the bit string. The number of bits must be 32 or
	        fewer.
	    */

	    _createClass(BitWriter, [{
	        key: "write",
	        value: function write(data, numBits) {
	            for (var i = numBits - 1; i >= 0; i--) {
	                if (data & 1 << i) {
	                    this.bits.push(1);
	                } else {
	                    this.bits.push(0);
	                }
	            }
	        }

	        /**
	            Get the bitstring represented as a javascript string of bytes
	        */

	    }, {
	        key: "getData",
	        value: function getData() {
	            var chars = [];
	            var b = 0;
	            var i = 0;

	            for (var j = 0; j < this.bits.length; j++) {
	                b = b << 1 | this.bits[j];
	                i += 1;
	                if (i === _constants.W) {
	                    chars.push(CHR(b));
	                    i = b = 0;
	                }
	            }

	            if (i) {
	                chars.push(CHR(b << _constants.W - i));
	            }

	            return chars.join("");
	        }

	        /**
	            Returns the bits as a human readable binary string for debugging
	         */

	    }, {
	        key: "getDebugString",
	        value: function getDebugString(group) {
	            var chars = [];
	            var i = 0;

	            for (var j = 0; j < this.bits.length; j++) {
	                chars.push("" + this.bits[j]);
	                i++;
	                if (i === group) {
	                    chars.push(' ');
	                    i = 0;
	                }
	            }

	            return chars.join("");
	        }
	    }]);

	    return BitWriter;
	})();

	exports.default = BitWriter;
	;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	// Configure the bit writing and reading functions to work natively in BASE-64
	// encoding. That way, we don't have to convert back and forth to bytes.

	var BASE64 = exports.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

	/**
	    Returns the decimal value of the given character unit.
	 */
	var BASE64_CACHE = exports.BASE64_CACHE = { "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7, "I": 8, "J": 9, "K": 10, "L": 11, "M": 12, "N": 13, "O": 14, "P": 15, "Q": 16, "R": 17, "S": 18, "T": 19, "U": 20, "V": 21, "W": 22, "X": 23, "Y": 24, "Z": 25, "a": 26, "b": 27, "c": 28, "d": 29, "e": 30, "f": 31, "g": 32, "h": 33, "i": 34, "j": 35, "k": 36, "l": 37, "m": 38, "n": 39, "o": 40, "p": 41, "q": 42, "r": 43, "s": 44, "t": 45, "u": 46, "v": 47, "w": 48, "x": 49, "y": 50, "z": 51, "0": 52, "1": 53, "2": 54, "3": 55, "4": 56, "5": 57, "6": 58, "7": 59, "8": 60, "9": 61, "-": 62, "_": 63 };

	/**
	    The width of each unit of the encoding, in bits. Here we use 6, for base-64
	    encoding.
	 */
	var W = exports.W = 6;

	/**
	    Fixed values for the L1 and L2 table sizes in the Rank Directory
	*/
	var L1 = exports.L1 = 32 * 32;
	var L2 = exports.L2 = 32;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _RankDirectory = __webpack_require__(5);

	var _RankDirectory2 = _interopRequireDefault(_RankDirectory);

	var _BitString = __webpack_require__(6);

	var _BitString2 = _interopRequireDefault(_BitString);

	var _constants = __webpack_require__(3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	  This class is used for traversing the succinctly encoded trie.
	  */

	var FrozenTrieNode = (function () {
	    function FrozenTrieNode(trie, index, letter, final, firstChild, childCount) {
	        _classCallCheck(this, FrozenTrieNode);

	        this.trie = trie;
	        this.index = index;
	        this.letter = letter;
	        this.final = final;
	        this.firstChild = firstChild;
	        this.childCount = childCount;
	    }

	    /**
	      Returns the number of children.
	      */

	    _createClass(FrozenTrieNode, [{
	        key: 'getChildCount',
	        value: function getChildCount() {
	            return this.childCount;
	        }

	        /**
	          Returns the FrozenTrieNode for the given child.
	           @param index The 0-based index of the child of this node. For example, if
	          the node has 5 children, and you wanted the 0th one, pass in 0.
	        */

	    }, {
	        key: 'getChild',
	        value: function getChild(index) {
	            return this.trie.getNodeByIndex(this.firstChild + index);
	        }
	    }]);

	    return FrozenTrieNode;
	})();

	/**
	    The FrozenTrie is used for looking up words in the encoded trie.

	    @param data A string representing the encoded trie.

	    @param directoryData A string representing the RankDirectory. The global L1
	    and L2 constants are used to determine the L1Size and L2size.

	    @param nodeCount The number of nodes in the trie.
	  */

	var FrozenTrie = (function () {
	    function FrozenTrie(data, directoryData, nodeCount) {
	        _classCallCheck(this, FrozenTrie);

	        this.data = new _BitString2.default(data);
	        this.nodeCount = nodeCount;
	        this.directory = new _RankDirectory2.default(directoryData, data, nodeCount * 2 + 1, _constants.L1, _constants.L2);

	        // The position of the first bit of the data in 0th node. In non-root
	        // nodes, this would contain 6-bit letters.
	        this.letterStart = nodeCount * 2 + 1;
	    }

	    /**
	       Retrieve the FrozenTrieNode of the trie, given its index in level-order.
	       This is a private function that you don't have to use.
	      */

	    _createClass(FrozenTrie, [{
	        key: 'getNodeByIndex',
	        value: function getNodeByIndex(index) {
	            // retrieve the 6-bit letter.
	            var final = this.data.get(this.letterStart + index * 6, 1) === 1;
	            var letter = String.fromCharCode(this.data.get(this.letterStart + index * 6 + 1, 5) + 'a'.charCodeAt(0));
	            var firstChild = this.directory.select(0, index + 1) - index;

	            // Since the nodes are in level order, this nodes children must go up
	            // until the next node's children start.
	            var childOfNextNode = this.directory.select(0, index + 2) - index - 1;

	            return new FrozenTrieNode(this, index, letter, final, firstChild, childOfNextNode - firstChild);
	        }

	        /**
	          Retrieve the root node. You can use this node to obtain all of the other
	          nodes in the trie.
	          */

	    }, {
	        key: 'getRoot',
	        value: function getRoot() {
	            return this.getNodeByIndex(0);
	        }

	        /**
	          Look-up a word in the trie. Returns true if and only if the word exists
	          in the trie.
	          */

	    }, {
	        key: 'lookup',
	        value: function lookup(word) {
	            var node = this.getRoot();
	            for (var i = 0; i < word.length; i++) {
	                var child;
	                var j = 0;
	                for (; j < node.getChildCount(); j++) {
	                    child = node.getChild(j);
	                    if (child.letter === word[i]) {
	                        break;
	                    }
	                }

	                if (j === node.getChildCount()) {
	                    return false;
	                }
	                node = child;
	            }

	            return node.final;
	        }

	        /**
	         * Serialize this frozen trie as JSON.
	         * @return {Object}
	         */

	    }, {
	        key: 'serialize',
	        value: function serialize() {
	            return {
	                trie: this.getData(),
	                directory: this.directory.getData(),
	                nodeCount: this.nodeCount
	            };
	        }

	        /**
	         * Deserialize a serialized FrozenTrie
	         * @param  {Object} json
	         * @return {FrozenTrie}
	         */

	    }], [{
	        key: 'deserialize',
	        value: function deserialize(json) {
	            return new FrozenTrie(json.trie, json.directory, json.nodeCount);
	        }

	        /**
	         * Construct a FrozenTrie out of a living Trie
	         * @static
	         * @param  {Trie} trie
	         * @return {FrozenTrie}
	         */

	    }, {
	        key: 'freeze',
	        value: function freeze(trie) {
	            var trieData = trie.encode();
	            var nodeCount = trie.getNodeCount();
	            var directory = _RankDirectory2.default.Create(trieData, nodeCount * 2 + 1, _constants.L1, _constants.L2);

	            return new FrozenTrie(trieData, directory.getData(), nodeCount);
	        }
	    }]);

	    return FrozenTrie;
	})();

	exports.default = FrozenTrie;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _BitString = __webpack_require__(6);

	var _BitString2 = _interopRequireDefault(_BitString);

	var _BitWriter = __webpack_require__(2);

	var _BitWriter2 = _interopRequireDefault(_BitWriter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	    The rank directory allows you to build an index to quickly compute the
	    rank() and select() functions. The index can itself be encoded as a binary
	    string.
	 */

	var RankDirectory = (function () {
	    _createClass(RankDirectory, null, [{
	        key: 'Create',

	        /**
	            Used to build a rank directory from the given input string.
	             @param data A javascript string containing the data, as readable using the
	            BitString object.
	             @param numBits The number of bits to index.
	             @param l1Size The number of bits that each entry in the Level 1 table
	            summarizes. This should be a multiple of l2Size.
	             @param l2Size The number of bits that each entry in the Level 2 table
	            summarizes.
	         */
	        value: function Create(data, numBits, l1Size, l2Size) {
	            var bits = new _BitString2.default(data);
	            var p = 0;
	            var i = 0;
	            var count1 = 0,
	                count2 = 0;
	            var l1bits = Math.ceil(Math.log(numBits) / Math.log(2));
	            var l2bits = Math.ceil(Math.log(l1Size) / Math.log(2));

	            var directory = new _BitWriter2.default();

	            while (p + l2Size <= numBits) {
	                count2 += bits.count(p, l2Size);
	                i += l2Size;
	                p += l2Size;
	                if (i === l1Size) {
	                    count1 += count2;
	                    directory.write(count1, l1bits);
	                    count2 = 0;
	                    i = 0;
	                } else {
	                    directory.write(count2, l2bits);
	                }
	            }

	            return new RankDirectory(directory.getData(), data, numBits, l1Size, l2Size);
	        }
	    }]);

	    function RankDirectory(directoryData, bitData, numBits, l1Size, l2Size) {
	        _classCallCheck(this, RankDirectory);

	        this.directory = new _BitString2.default(directoryData);
	        this.data = new _BitString2.default(bitData);
	        this.l1Size = l1Size;
	        this.l2Size = l2Size;
	        this.l1Bits = Math.ceil(Math.log(numBits) / Math.log(2));
	        this.l2Bits = Math.ceil(Math.log(l1Size) / Math.log(2));
	        this.sectionBits = (l1Size / l2Size - 1) * this.l2Bits + this.l1Bits;
	        this.numBits = numBits;
	    }

	    /**
	        Returns the string representation of the directory.
	     */

	    _createClass(RankDirectory, [{
	        key: 'getData',
	        value: function getData() {
	            return this.directory.getData();
	        }

	        /**
	          Returns the number of 1 or 0 bits (depending on the "which" parameter) to
	          to and including position x.
	          */

	    }, {
	        key: 'rank',
	        value: function rank(which, x) {

	            if (which === 0) {
	                return x - this.rank(1, x) + 1;
	            }

	            var rank = 0;
	            var o = x;
	            var sectionPos = 0;

	            if (o >= this.l1Size) {
	                sectionPos = (o / this.l1Size | 0) * this.sectionBits;
	                rank = this.directory.get(sectionPos - this.l1Bits, this.l1Bits);
	                o = o % this.l1Size;
	            }

	            if (o >= this.l2Size) {
	                sectionPos += (o / this.l2Size | 0) * this.l2Bits;
	                rank += this.directory.get(sectionPos - this.l2Bits, this.l2Bits);
	            }

	            rank += this.data.count(x - x % this.l2Size, x % this.l2Size + 1);

	            return rank;
	        }

	        /**
	          Returns the position of the y'th 0 or 1 bit, depending on the "which"
	          parameter.
	          */

	    }, {
	        key: 'select',
	        value: function select(which, y) {
	            var high = this.numBits;
	            var low = -1;
	            var val = -1;

	            while (high - low > 1) {
	                var probe = (high + low) / 2 | 0;
	                var r = this.rank(which, probe);

	                if (r === y) {
	                    // We have to continue searching after we have found it,
	                    // because we want the _first_ occurrence.
	                    val = probe;
	                    high = probe;
	                } else if (r < y) {
	                    low = probe;
	                } else {
	                    high = probe;
	                }
	            }

	            return val;
	        }
	    }]);

	    return RankDirectory;
	})();

	exports.default = RankDirectory;
	;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _constants = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function ORD(ch) {
	    // Used to be: return BASE64.indexOf(ch);
	    return _constants.BASE64_CACHE[ch];
	}

	/**
	    Given a string of data (eg, in BASE-64), the BitString class supports
	    reading or counting a number of bits from an arbitrary position in the
	    string.
	*/

	var BitString = (function () {
	    function BitString() {
	        _classCallCheck(this, BitString);
	    }

	    _createClass(BitString, [{
	        key: 'init',
	        value: function init(str) {
	            this.bytes = str;
	            this.length = this.bytes.length * _constants.W;
	        }

	        /**
	          Returns the internal string of bytes
	        */

	    }, {
	        key: 'getData',
	        value: function getData() {
	            return this.bytes;
	        }

	        /**
	            Returns a decimal number, consisting of a certain number, n, of bits
	            starting at a certain position, p.
	         */

	    }, {
	        key: 'get',
	        value: function get(p, n) {

	            // case 1: bits lie within the given byte
	            if (p % _constants.W + n <= _constants.W) {
	                return (ORD(this.bytes[p / _constants.W | 0]) & BitString.MaskTop[p % _constants.W]) >> _constants.W - p % _constants.W - n;

	                // case 2: bits lie incompletely in the given byte
	            } else {
	                    var result = ORD(this.bytes[p / _constants.W | 0]) & BitString.MaskTop[p % _constants.W];

	                    var l = _constants.W - p % _constants.W;
	                    p += l;
	                    n -= l;

	                    while (n >= _constants.W) {
	                        result = result << _constants.W | ORD(this.bytes[p / _constants.W | 0]);
	                        p += _constants.W;
	                        n -= _constants.W;
	                    }

	                    if (n > 0) {
	                        result = result << n | ORD(this.bytes[p / _constants.W | 0]) >> _constants.W - n;
	                    }

	                    return result;
	                }
	        }

	        /**
	            Counts the number of bits set to 1 starting at position p and
	            ending at position p + n
	         */

	    }, {
	        key: 'count',
	        value: function count(p, n) {

	            var count = 0;
	            while (n >= 8) {
	                count += BitString.BitsInByte[this.get(p, 8)];
	                p += 8;
	                n -= 8;
	            }

	            return count + BitString.BitsInByte[this.get(p, n)];
	        }

	        /**
	            Returns the number of bits set to 1 up to and including position x.
	            This is the slow implementation used for testing.
	        */

	    }, {
	        key: 'rank',
	        value: function rank(x) {
	            var rank = 0;
	            for (var i = 0; i <= x; i++) {
	                if (this.get(i, 1)) {
	                    rank++;
	                }
	            }

	            return rank;
	        }
	    }]);

	    return BitString;
	})();

	exports.default = BitString;
	;

	BitString.MaskTop = [0x3f, 0x1f, 0x0f, 0x07, 0x03, 0x01, 0x00];

	BitString.BitsInByte = [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8];

/***/ }
/******/ ])
});
;