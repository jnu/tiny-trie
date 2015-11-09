(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["TinyTrie"] = factory();
	else
		root["TinyTrie"] = factory();
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
	exports.createFrozenSync = createFrozenSync;

	var _Trie = __webpack_require__(1);

	var _Trie2 = _interopRequireDefault(_Trie);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Synchronously construct a new Trie out of the given strings.
	 * @param  {String[]} words
	 * @return {Trie}
	 */
	function createSync(strings) {
	  var trie = new _Trie2.default();

	  strings.forEach(function (s) {
	    return trie.insert(s);
	  });

	  return trie;
	}

	/**
	 * Create a frozen Trie out of given words
	 * @param  {String[]} words
	 * @return {Trie}
	 */
	function createFrozenSync(string) {
	  return createSync(string).freeze();
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _floor_log = __webpack_require__(2);

	var _floor_log2 = _interopRequireDefault(_floor_log);

	var _BinaryString = __webpack_require__(3);

	var _BinaryString2 = _interopRequireDefault(_BinaryString);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * String terminal character
	 * @type {String}
	 */
	var TERMINAL = '\0';

	/**
	 * Terminal edge
	 * @type {Object}
	 */
	var TERMINUS = Object.create(null);

	/**
	 * A structure to provide efficient lookups for a
	 * @class Trie
	 */

	var Trie = (function () {

	    /**
	     * Typically no arguments are needed.
	     * @param  {Object} tree - a trie given as a vanilla JS tree. This will be
	     *                         used as the root node.
	     * @return {Trie}
	     */

	    function Trie() {
	        var tree = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        _classCallCheck(this, Trie);

	        this.root = tree;
	        this.frozen = false;
	    }

	    /**
	     * Insert a word into the trie. Insertions into a frozen trie will throw
	     * an error. The
	     * @param  {String} string - string to insert. Note the \u0000 character is
	     *                           disallowed.
	     * @return {Trie} - this
	     */

	    _createClass(Trie, [{
	        key: 'insert',
	        value: function insert(string) {
	            // This trie insert algorithm can't guarantee safe inserts on the DAWG
	            // produced by freezing.
	            if (this.frozen) {
	                throw new SyntaxError("Can't insert into frozen Trie");
	            }

	            var lastNode = string.split('').reduce(function (node, char) {
	                if (char === TERMINAL) {
	                    throw new TypeError('Illegal string character ' + TERMINAL);
	                }
	                var nextNode = node.hasOwnProperty(char) ? node[char] : node[char] = {};
	                return nextNode;
	            }, this.root);

	            // Terminate the string. Using a constant terminus is not necessary
	            // (and is not be possible in cloned tries), but it uses slightly less
	            // memory and could make certain bugs more obvious.
	            lastNode[TERMINAL] = TERMINUS;

	            return this;
	        }

	        /**
	         * Test membership in the trie
	         * @param  {String} string
	         * @return {Boolean}
	         */

	    }, {
	        key: 'test',
	        value: function test(string) {
	            var node = this.root;
	            var match = string.split('').every(function (char) {
	                return node = node[char];
	            });
	            return !!match && node.hasOwnProperty(TERMINAL);
	        }

	        /**
	         * Clone a Trie. This will unfreeze a frozen trie.
	         * @return {Trie}
	         */

	    }, {
	        key: 'clone',
	        value: function clone() {
	            return new Trie(JSON.parse(JSON.stringify(this.root)));
	        }

	        /**
	         * Freeze the Trie, deduping suffixes. Given the assumption that there will
	         * not be new entries into a trie, redundant suffix branches can be merged.
	         * @return {Trie} - This trie (freezing modifies it in place)
	         */

	    }, {
	        key: 'freeze',
	        value: function freeze() {
	            // Freezing is idempotent
	            if (this.frozen) {
	                return this;
	            }

	            // Create a store for fast lookup of matching suffixes during walk
	            var suffixTree = {};

	            // Walk the entire trie depth first, de-duping suffixes
	            var node = this.root;
	            var stack = [];
	            var depthStack = [node];

	            // Iterate over tree nodes, pushing children onto the depthStack so
	            // that the items pushed on to the main `stack` are in the correct
	            // order for a second traversal.
	            while (depthStack.length) {
	                node = depthStack.pop();

	                Object.keys(node).forEach(function (char) {
	                    if (char[1] === '_') {
	                        return;
	                    }
	                    var current = node[char];
	                    stack.push({
	                        current: current,
	                        char: char,
	                        parent: node
	                    });
	                    depthStack.push(current);
	                });
	            }

	            // Now do node processing, joining / deduping suffix lines.

	            var _loop = function _loop() {
	                var _stack$pop = stack.pop();

	                var char = _stack$pop.char;
	                var parent = _stack$pop.parent;
	                var current = _stack$pop.current;

	                // Find potential suffix duplicates with a char lookup

	                if (suffixTree.hasOwnProperty(char)) {
	                    var suffixMeta = suffixTree[char];

	                    // Find a matching suffix by comparing children. Since
	                    // deduping is depth-first, comparing children by identity
	                    // is a valid way to check if this node is a duplicate.
	                    var match = suffixMeta.find(function (other) {
	                        var oKeys = Object.keys(other);
	                        var cKeys = Object.keys(current);
	                        return oKeys.length === cKeys.length && oKeys.every(function (key) {
	                            return other[key] === current[key];
	                        });
	                    });

	                    // If this node is a dupe, update its parent reference to
	                    // point to the cached match.
	                    if (match) {
	                        parent[char] = match;
	                    }
	                    // If the node is novel, cache it for future checks.
	                    else {
	                            suffixMeta.push(current);
	                        }
	                }
	                // If this char is novel, create a new suffixMeta entry
	                else {
	                        suffixTree[char] = [current];
	                    }
	            };

	            while (stack.length) {
	                _loop();
	            }

	            // Flag the tree as frozen
	            this.frozen = true;

	            return this;
	        }

	        /**
	         * Encode the Trie in a binary format. This format stores the trie or DAWG
	         * efficiently and still allows for fast queries.
	         * @return {Object}
	         */

	    }, {
	        key: 'encode',
	        value: function encode() {
	            var chunks = [];
	            var queue = [this.root];
	            var charTable = new Set();
	            var visitCode = Date.now();
	            var offsetMin = Infinity;
	            var offsetMax = -Infinity;

	            var _loop2 = function _loop2() {
	                var node = queue.shift();
	                var keys = Object.keys(node).filter(function (k) {
	                    return k[1] !== '_';
	                });
	                var n = keys.length;

	                node.__visited__ = visitCode;
	                var nodeChunkIndex = node.__idx__ = chunks.length;

	                // Fill in the parent chunks that are waiting to find out what
	                // index this chunk gets assigned
	                if (node.__parents__) {
	                    node.__parents__.forEach(function (chunk) {
	                        var offset = chunk.offset = nodeChunkIndex - chunk.idx;
	                        if (offset < offsetMin) {
	                            offsetMin = offset;
	                        }
	                        if (offset > offsetMax) {
	                            offsetMax = offset;
	                        }
	                    });
	                }

	                keys.forEach(function (char, i) {
	                    var child = node[char];
	                    var chunkIdx = chunks.length;
	                    var lastInLevel = i === n - 1;

	                    var newChunk = {
	                        char: char,
	                        idx: chunkIdx,
	                        offset: null,
	                        last: lastInLevel
	                    };

	                    // If the child has been visited, jump directly to that node
	                    // instead of creating a new entry.
	                    if (child.__visited__ === visitCode) {
	                        var idx = child.__idx__;
	                        var offset = newChunk.offset = idx - chunkIdx;
	                        if (offset < offsetMin) {
	                            offsetMin = offset;
	                        }
	                        if (offset > offsetMax) {
	                            offsetMax = offset;
	                        }
	                    }
	                    // If child is novel, add it to the process queue and add an
	                    // instruction to jump there.
	                    else {
	                            if (child.__willVisit__ === visitCode) {
	                                child.__parents__.push(newChunk);
	                            } else {
	                                child.__willVisit__ = visitCode;
	                                child.__parents__ = [newChunk];
	                            }
	                            queue.push(child);
	                        }

	                    // Add a new chunk to the array
	                    chunks.push(newChunk);

	                    // Ensure that the char is in the chartable
	                    charTable.add(char);
	                });
	            };

	            while (queue.length) {
	                _loop2();
	            }

	            // Assign a unique integer ID to each character. The actual ID is
	            // arbitrary.
	            var charTableAsArray = Array.from(charTable);
	            var charMap = charTableAsArray.reduce(function (agg, char, i) {
	                agg[char] = i;
	                return agg;
	            }, {});
	            var charEncodingWidth = (0, _floor_log2.default)(charTableAsArray.length - 1) + 1;

	            var pointerRange = offsetMax - offsetMin;
	            var pointerEncodingWidth = (0, _floor_log2.default)(pointerRange) + 1;

	            // The binary with of node encodings is variable. There are three parts
	            // that get encoded:
	            //
	            //  1) character index (corresponding to character table),
	            //  2) pointer (as offset from start of word to next node),
	            //  3) last (flag to indicate whether this is the last block in this
	            //     subtree)
	            //
	            // The width of the first two items are determined as the binary width
	            // of the unsigned integer representing the maximum in the range. The
	            // width of the third is a constant 1 binary digit.
	            //
	            // E.g., if the charTable is 28 characters in length, then the binary
	            // digit representing 27 (the last item in the array) is:
	            //
	            //   1 1011
	            //
	            // So the width is determined to be 5. If the pointer range has a
	            // maximum of 250, represented in binary as:
	            //
	            //   1111 1010
	            //
	            // Giving a width of 8. With these specifications, a node such as:
	            //
	            //   charIndex: 8, pointer: 100, last: false
	            //
	            // Would be encoded as:
	            //
	            //   --A---|----B-----|C|XXXXX
	            //   0100 0|011 0010 0|1|00 00
	            //
	            // Which can be represented in Base64 as:
	            //
	            //   QyQ==
	            //
	            // TODO could be more clever and combine the first two fields.

	            var encodedTrie = new _BinaryString2.default();

	            chunks.forEach(function (chunk) {
	                var char = chunk.char;
	                var offset = chunk.offset;
	                var last = chunk.last;

	                encodedTrie.write(charMap[char], charEncodingWidth);
	                encodedTrie.write(offset - offsetMin, pointerEncodingWidth);
	                encodedTrie.write(+last, 1);
	            });

	            encodedTrie.flush();

	            return {
	                table: charTableAsArray.join(''),
	                offset: offsetMin,
	                dimensions: [charEncodingWidth, pointerEncodingWidth],
	                data: encodedTrie.getData()
	            };
	        }

	        /**
	         * Implement JSON API for serialization. Tries can be serialized and
	         * restored using JSON and the constructor. Note that tries (even frozen
	         * ones) *do not serialize efficiently in JSON*. For memory-efficient
	         * tries, @see Trie#encode.
	         *
	         * @example
	         *   > trie = new Trie();
	         *   > ['foo', 'fudge', 'nudge'].forEach(s => trie.insert(s));
	         *   > let jsonStr = JSON.stringify(trie);
	         *   > let restored = new Trie(JSON.parse(jsonStr));
	         *   > ['foo', 'fudge', 'nudge'].every(s => restored.test(s));
	         *   // -> true
	         *
	         * @return {Object} Vanilla JS object
	         */

	    }, {
	        key: 'toJSON',
	        value: function toJSON() {
	            return JSON.parse(JSON.stringify(this.root));
	        }
	    }]);

	    return Trie;
	})();

	exports.default = Trie;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = floor_log2;
	/**
	 * Fast floor(log2(x)) operation
	 * @param  {Number} x
	 * @return {Number}
	 */
	function floor_log2(x) {
	    var n = 0;
	    while (x >>= 1) {
	        n++;
	    }
	    return n;
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _floor_log = __webpack_require__(2);

	var _floor_log2 = _interopRequireDefault(_floor_log);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Lookup table for transforming a 6-bit binary integer into a Base-64 ASCII
	 * character.
	 * @type {String[]}
	 */
	var BASE64_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

	/**
	 * Interface for writing binary data into a Base64-encoded string
	 */

	var BinaryString = (function () {
	    function BinaryString() {
	        _classCallCheck(this, BinaryString);

	        /**
	         * Data buffer
	         * @type {Number?}
	         */
	        this.buffer = 0;

	        /**
	         * Word pointer for buffer. With every entry into the buffer, the
	         * pointer gets incremented by the entry's width. Every six characters
	         * may be encoded, so when the pointer exceeds 6, the buffer can be
	         * emptied until the pointer is back under 6.
	         * @type {Number}
	         */
	        this.pointer = 0;

	        /**
	         * Encoded data as a string of base64 characters
	         * @type {String}
	         */
	        this.data = '';
	    }

	    /**
	     * Write a value to the binary string. This value should be thought of as
	     * an integer representing the binary data to write.
	     * @param  {Integer} val - data to write
	     * @param  {Integer} [width] - optionally specify a width for this data.
	     *                             if none is given, width will be inferred
	     *                             automatically. An error will be thrown if
	     *                             the width is too small to contain the data.
	     * @return {[type]}       [description]
	     */

	    _createClass(BinaryString, [{
	        key: 'write',
	        value: function write(val) {
	            var width = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

	            var buf = this.buffer;
	            var len = width || (0, _floor_log2.default)(val) + 1;

	            if (width && val >= 0x1 << width) {
	                throw new Error('Can\'t write ' + val + ' in only ' + width + ' bits');
	            }

	            this.buffer = buf << len | val;
	            this.pointer += len;

	            this._digest();
	        }

	        /**
	         * Encode the remaining items in the buffer. Use this when the input stream
	         * is finished to ensure that all data has been encoded.
	         */

	    }, {
	        key: 'flush',
	        value: function flush() {
	            var buffer = this.buffer;
	            var pointer = this.pointer;
	            while (pointer < 6) {
	                buffer <<= 1;
	                pointer += 1;
	            }
	            this.pointer = pointer;
	            this.buffer = buffer;
	            this._digest();
	        }

	        /**
	         * Get the binary data as base64. This output does not include padding
	         * characters. This procedure flushes the buffer.
	         * @return {String}
	         */

	    }, {
	        key: 'getData',
	        value: function getData() {
	            this.flush();
	            return this.data;
	        }

	        // Process as many items from the buffer as possible

	    }, {
	        key: '_digest',
	        value: function _digest() {
	            var buffer = this.buffer;
	            var pointer = this.pointer;
	            var newData = '';
	            while (pointer >= 6) {
	                var remainder = pointer - 6;
	                var code = buffer >> remainder;
	                buffer = buffer ^ code << remainder;
	                pointer = remainder;
	                newData += BASE64_TABLE[code];
	            }
	            this.pointer = pointer;
	            this.buffer = buffer;
	            this.data += newData;
	        }
	    }]);

	    return BinaryString;
	})();

	exports.default = BinaryString;

/***/ }
/******/ ])
});
;