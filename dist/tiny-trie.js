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
	exports.Trie = undefined;

	var _Trie = __webpack_require__(3);

	Object.defineProperty(exports, 'Trie', {
	  enumerable: true,
	  get: function get() {
	    return _Trie.default;
	  }
	});
	exports.createSync = createSync;
	exports.createFrozenSync = createFrozenSync;

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
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * @file Lookup tables for Base64 conversions
	 */

	/**
	 * Lookup table for transforming a 6-bit binary integer into a Base-64 ASCII
	 * character.
	 * @constant {String[]}
	 */
	var BASE64_INT_TO_CHAR = exports.BASE64_INT_TO_CHAR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

	/**
	 * Inverse lookup table for transformating a Base-64 ASCII character into the
	 * corresponding integer value.
	 * @constant {Object}
	 */
	var BASE64_CHAR_TO_INT = exports.BASE64_CHAR_TO_INT = BASE64_INT_TO_CHAR.reduce(function (agg, char, i) {
	  agg[char] = i;
	  return agg;
	}, {});

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * @file Parameters used for encoding
	 */

	/**
	 * String terminal character
	 * @constant {String}
	 */
	var TERMINAL = exports.TERMINAL = '\0';

	/**
	 * Terminal edge
	 * @constant {Object}
	 */
	var TERMINUS = exports.TERMINUS = Object.create(null);

	/**
	 * Encoding version. Bump when breaking encoding changes are introduced.
	 * @constant {Number}
	 */
	var VERSION = exports.VERSION = 0;

	/**
	 * Width of header field storing entire header width (including char table).
	 * Value is given in Base64 characters (i.e., every six bits)
	 * @constant {Number}
	 */
	var HEADER_WIDTH_FIELD = exports.HEADER_WIDTH_FIELD = 10;

	/**
	 * Width of version field
	 * @type {Number}
	 */
	var VERSION_FIELD = exports.VERSION_FIELD = 10;

	/**
	 * Width of header field representing sign of offset
	 * @constant {Number}
	 */
	var OFFSET_SIGN_FIELD = exports.OFFSET_SIGN_FIELD = 1;

	/**
	 * Width of header field representing unsigned value of offset
	 * @constant {Number}
	 */
	var OFFSET_VAL_FIELD = exports.OFFSET_VAL_FIELD = 21;

	/**
	 * Width of header field representing the width of the char index in a word
	 * @constant {Number}
	 */
	var CHAR_WIDTH_FIELD = exports.CHAR_WIDTH_FIELD = 8;

	/**
	 * Width of header field representing the width of the offset pointer in a word
	 * @constant {Number}
	 */
	var POINTER_WIDTH_FIELD = exports.POINTER_WIDTH_FIELD = 8;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * @file Provides the Trie class
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        */

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _floor_log = __webpack_require__(4);

	var _floor_log2 = _interopRequireDefault(_floor_log);

	var _BinaryString = __webpack_require__(5);

	var _BinaryString2 = _interopRequireDefault(_BinaryString);

	var _constants = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * A structure to provide efficient membership tests for a set of strings
	 * @class
	 */

	var Trie = (function () {

	    /**
	     * Typically no arguments are needed, but it's possible to instantiate a
	     * Trie from a JSON object that represents it (@see Trie#toJSON).
	     * @constructor
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
	                if (char === _constants.TERMINAL) {
	                    throw new TypeError('Illegal string character ' + _constants.TERMINAL);
	                }
	                var nextNode = node.hasOwnProperty(char) ? node[char] : node[char] = {};
	                return nextNode;
	            }, this.root);

	            // Terminate the string. Using a constant terminus is not necessary
	            // (and is not be possible in cloned tries), but it uses slightly less
	            // memory and could make certain bugs more obvious.
	            lastNode[_constants.TERMINAL] = _constants.TERMINUS;

	            return this;
	        }

	        /**
	         * Test membership in the trie.
	         * @param  {String} string - Search query
	         * @param  {String?} opts.wildcard - See Trie#search wildcard doc
	         * @param  {Boolean?} opts.prefix - See Trie#search prefix doc
	         * @return {Boolean}
	         */

	    }, {
	        key: 'test',
	        value: function test(string) {
	            var _this = this;

	            var _ref = arguments.length <= 1 || arguments[1] === undefined ? { wildcard: null, prefix: false } : arguments[1];

	            var wildcard = _ref.wildcard;
	            var prefix = _ref.prefix;

	            // When there are no wildcards we can use an optimized search.
	            if (!wildcard) {
	                var _ret = (function () {
	                    var node = _this.root;
	                    var match = string.split('').every(function (char) {
	                        return node = node[char];
	                    });
	                    return {
	                        v: !!match && (prefix || node.hasOwnProperty(_constants.TERMINAL))
	                    };
	                })();

	                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	            }

	            // Unoptimized path: delegate to #search with short-circuiting.
	            return !!this.search(string, { wildcard: wildcard, prefix: prefix, first: true });
	        }

	        /**
	         * Query for matching words in the trie.
	         * @param  {String} string - Search query
	         * @param  {String?} opts.wildcard - Wildcard to use for fuzzy matching.
	         *                                   Default is no wildcard; only match
	         *                                   literal query.
	         * @param  {Boolean?} opts.prefix - Perform prefix search (returns true if
	         *                                  any word exists in the trie starts with
	         *                                  the search query). Default is false;
	         *                                  only match the full query.
	         * @param  {Boolean} opts.first - Return only first match that is found,
	         *                                short-circuiting the search. Default is
	         *                                false; return all matches.
	         * @return {String?|String[]} - Return an optional string result when in
	         *                              first-only mode; otherwise return a list
	         *                              of strings that match the query.
	         */

	    }, {
	        key: 'search',
	        value: function search(string) {
	            var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? { wildcard: null, prefix: false, first: false } : arguments[1];

	            var wildcard = _ref2.wildcard;
	            var prefix = _ref2.prefix;
	            var first = _ref2.first;

	            // Validate wildcard matching.
	            if (wildcard && wildcard.length !== 1) {
	                throw new Error('Wildcard length must be 1; got ' + wildcard.length);
	            }

	            // List of search hits. Note: not used in `first` mode.
	            var matches = [];

	            // Do a BFS over nodes to with fuzzy-matching on the wildcard.
	            var queue = [{ data: this.root, depth: 0, memo: '' }];
	            var lastDepth = string.length;

	            while (queue.length) {
	                var node = queue.shift();
	                // The search is a hit if we've reached the proper depth and the
	                // node is terminal. The search can break if the query was for
	                // first-only.
	                if (node.depth >= lastDepth) {
	                    if (node.data.hasOwnProperty(_constants.TERMINAL)) {
	                        if (first) {
	                            return node.memo;
	                        }
	                        // Otherwise store this result and continue searching.
	                        matches.push(node.memo);
	                    }
	                    // Discard the node and move on if we can; prefix matches need
	                    // to traverse everything.
	                    if (!prefix) {
	                        continue;
	                    }
	                }
	                // Special case: prefix searches overflow the length of the search
	                // queries. Treat these overflowing chars as wildcards.
	                var isPfXOverflow = prefix && node.depth >= lastDepth;
	                // Add any candidate children nodes to the search queue.
	                var token = string[node.depth];
	                // Wildcard could be any child (except terminal).
	                if (token === wildcard || isPfXOverflow) {
	                    Object.keys(node.data).forEach(function (n) {
	                        if (n !== _constants.TERMINAL) {
	                            queue.push({
	                                data: node.data[n],
	                                depth: node.depth + 1,
	                                memo: node.memo + n
	                            });
	                        }
	                    });
	                } else {
	                    if (node.data.hasOwnProperty(token)) {
	                        queue.push({
	                            data: node.data[token],
	                            depth: node.depth + 1,
	                            memo: node.memo + token
	                        });
	                    }
	                }
	            }

	            // A `first` search will have broken out and returned a literal by now;
	            // other searches just return whatever is in matches.
	            return first ? null : matches;
	        }

	        /**
	         * Clone a Trie. This will unfreeze a frozen trie.
	         * @return {Trie}
	         */

	    }, {
	        key: 'clone',
	        value: function clone() {
	            return new Trie(this.toJSON());
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

	            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	            // Encode trie
	            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
	            // arbitrary. For the convenience of not having to serialize the \0
	            // character, the TERMINAL is always encoded at the 0 index, and it is
	            // not included in the charTable.
	            var charTableAsArray = Array.from(charTable).filter(function (char) {
	                return char !== _constants.TERMINAL;
	            });
	            var charMap = charTableAsArray.reduce(function (agg, char, i) {
	                agg[char] = i + 1;
	                return agg;
	            }, _defineProperty({}, _constants.TERMINAL, 0));
	            // Determine the number of bits that can index the entire charTable.
	            var charEncodingWidth = (0, _floor_log2.default)(charTableAsArray.length) + 1;

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

	            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	            // Encode header
	            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	            var headerString = new _BinaryString2.default();
	            var outputCharTable = charTableAsArray.join('');

	            // Header width designates the ASCII-character count at the beginning
	            // of the file that encodes the header.
	            var headerWidth = Math.ceil((_constants.HEADER_WIDTH_FIELD + _constants.VERSION_FIELD + _constants.OFFSET_SIGN_FIELD + _constants.OFFSET_VAL_FIELD + _constants.CHAR_WIDTH_FIELD + _constants.POINTER_WIDTH_FIELD) / 6) + outputCharTable.length;
	            // Mark the offset as positive or negative
	            var offsetSign = +(offsetMin < 0);

	            headerString.write(headerWidth, _constants.HEADER_WIDTH_FIELD);
	            headerString.write(_constants.VERSION, _constants.VERSION_FIELD);
	            headerString.write(offsetSign, _constants.OFFSET_SIGN_FIELD);
	            headerString.write(offsetSign ? -offsetMin : offsetMin, _constants.OFFSET_VAL_FIELD);
	            headerString.write(charEncodingWidth, _constants.CHAR_WIDTH_FIELD);
	            headerString.write(pointerEncodingWidth, _constants.POINTER_WIDTH_FIELD);
	            headerString.flush();

	            // Concat the header, charTable, and trie
	            return '' + headerString.getData() + outputCharTable + encodedTrie.getData();
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
	            // Remove any private fields on serialization, e.g. __visited__
	            var str = JSON.stringify(this.root, function (k, v) {
	                if (k[1] === '_') {
	                    return undefined;
	                }
	                return v;
	            });
	            return JSON.parse(str);
	        }
	    }]);

	    return Trie;
	})();

	exports.default = Trie;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = floor_log2;
	/**
	 * @file Provides a fast floor_log2 function
	 */

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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * @file Provide an interface for writing binary data into a Base64-encoded
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * string.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        */

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _floor_log = __webpack_require__(4);

	var _floor_log2 = _interopRequireDefault(_floor_log);

	var _base = __webpack_require__(1);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Interface for writing binary data into a Base64-encoded string
	 * @class
	 */

	var BinaryString = (function () {

	  /**
	   * No arguments are necessary.
	   * @constructor
	   * @return {BinaryString}
	   */

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
	      // NB if pointer is at 0, there's nothing to flush.
	      while (pointer && pointer < 6) {
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

	    /**
	     * Write values from the buffer into the binary encoded string until the
	     * pointer is below 6. Use @link BinaryString#flush to print out all values
	     * regardless of whether they are complete and return the pointer to 0.
	     *
	     * This method is used internally during writes and does not need to be
	     * called explicitly.
	     * @private
	     */

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
	        newData += _base.BASE64_INT_TO_CHAR[code];
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