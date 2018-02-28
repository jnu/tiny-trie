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

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * @file Small class for querying a binary-encoded Trie
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * TODO - rewrite as a native class. Babel adds a lot of overhead. This class
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * should be tiny and transparent.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        */

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _base = __webpack_require__(1);

	var _constants = __webpack_require__(2);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Extract a window of bits from a Base64 encoded sequence
	 * @param  {String} binary - base64 encoded sequence
	 * @param  {Number} start - first bit to read
	 * @param  {Number} len - number of bits to read
	 * @return {Number} - bits from string, as number
	 */
	function readBits(binary, start, len) {
	    var startChar = ~ ~(start / 6);
	    var startBitOffset = start % 6;
	    var endBit = startBitOffset + len;
	    var charLen = Math.ceil(endBit / 6);
	    var mask = (0x1 << len) - 1;
	    var chunk = 0;

	    for (var i = 0; i < charLen; i++) {
	        chunk <<= 6;
	        chunk |= _base.BASE64_CHAR_TO_INT[binary[startChar + i]];
	    }

	    var rightPadding = endBit % 6;
	    if (rightPadding) {
	        chunk >>= 6 - rightPadding;
	    }

	    return chunk & mask;
	}

	/**
	 * Class for interacting with an encoded trie. The class performs lookups
	 * virtually just as fast as a regular trie. The binary data never actually
	 * have to be processed as a whole, so instantiation time and memory usage are
	 * phenomenally low.
	 * @class
	 */

	var PackedTrie = (function () {

	    /**
	     * Instantiate a packed binary trie, parsing its headers to configure the
	     * instance for queries.
	     * @constructor
	     * @param  {String} binary - binary string from {@link Trie#encode}
	     * @return {PackedTrie}
	     */

	    function PackedTrie(binary) {
	        _classCallCheck(this, PackedTrie);

	        var ptr = 0;

	        // Split binary into header and content by checking first field
	        var headerCharCount = readBits(binary, ptr, _constants.HEADER_WIDTH_FIELD);
	        ptr += _constants.HEADER_WIDTH_FIELD;
	        var header = binary.substr(0, headerCharCount);

	        var version = readBits(binary, ptr, _constants.VERSION_FIELD);
	        ptr += _constants.VERSION_FIELD;

	        if (version !== _constants.VERSION) {
	            throw new Error('Version mismatch! Binary: ' + version + ', Reader: ' + _constants.VERSION);
	        }

	        /**
	         * Binary string encoded as Base64 representing Trie
	         * @type {String}
	         */
	        this.data = binary.substr(headerCharCount);

	        // compute pointer offset

	        var offsetSign = readBits(header, ptr, _constants.OFFSET_SIGN_FIELD);
	        ptr += _constants.OFFSET_SIGN_FIELD;
	        var offset = readBits(header, ptr, _constants.OFFSET_VAL_FIELD);
	        ptr += _constants.OFFSET_VAL_FIELD;

	        if (offsetSign) {
	            offset = -offset;
	        }
	        /**
	         * Pointer offset. Add this to every pointer read from every word in
	         * the trie to obtain the true value of the pointer. This offset is
	         * used to avoid signed integers in the word.
	         * @type {Number}
	         */
	        this.offset = offset;

	        // interpret the field width within each word
	        var charWidth = readBits(header, ptr, _constants.CHAR_WIDTH_FIELD);
	        ptr += _constants.CHAR_WIDTH_FIELD;

	        var pointerWidth = readBits(header, ptr, _constants.POINTER_WIDTH_FIELD);
	        ptr += _constants.POINTER_WIDTH_FIELD;

	        // Interpret the rest of the header as the charTable
	        var headerFieldChars = Math.ceil(ptr / 6);
	        var charTable = header.substr(headerFieldChars);

	        /**
	         * Character table, mapping character to an integer ID
	         * @type {Object}
	         */
	        this.table = charTable.split('').reduce(function (agg, char, i) {
	            agg[char] = i + 1;
	            return agg;
	        }, _defineProperty({}, _constants.TERMINAL, 0));

	        /**
	         * Inverse of character table, mapping integer ID to character.
	         * @type {Array}
	         */
	        this.inverseTable = [_constants.TERMINAL].concat(charTable.split(''));

	        /**
	         * Number of bits in one word
	         * @type {Number}
	         */
	        this.wordWidth = charWidth + pointerWidth + 1;

	        /**
	         * Mask for reading the "last block" flag in a word
	         * @type {Number}
	         */
	        this.lastMask = 0x1;

	        /**
	         * Mask for reading the pointer value from a word
	         * @type {Number}
	         */
	        this.pointerMask = (0x1 << pointerWidth) - 1;

	        /**
	         * Offset of pointer field in a word
	         * @type {Number}
	         */
	        this.pointerShift = 1;

	        /**
	         * Mask for reading the charTable index in a word
	         * @type {Number}
	         */
	        this.charMask = (0x1 << charWidth) - 1;

	        /**
	         * Offset of charTable index field in a word
	         * @type {Number}
	         */
	        this.charShift = 1 + pointerWidth;
	    }

	    /**
	     * Test membership in the trie.
	     * @param  {String} string - Search query
	     * @param  {String?} opts.wildcard - See PackedTrie#search wildcard doc
	     * @param  {Boolean?} opts.prefix - See PackedTrie#search prefix doc
	     * @return {Boolean}
	     */

	    _createClass(PackedTrie, [{
	        key: 'test',
	        value: function test(string) {
	            var _ref = arguments.length <= 1 || arguments[1] === undefined ? { wildcard: null, prefix: false } : arguments[1];

	            var wildcard = _ref.wildcard;
	            var prefix = _ref.prefix;

	            // Delegate to #search with early exit. Could write an optimized path,
	            // especially for the prefix search case.
	            return this.search(string, { wildcard: wildcard, prefix: prefix, first: true }) !== null;
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

	            if (wildcard && wildcard.length !== 1) {
	                throw new Error('Wilcard must be a single character; got ' + wildcard);
	            }

	            var data = this.data;
	            var offset = this.offset;
	            var table = this.table;
	            var inverseTable = this.inverseTable;
	            var wordWidth = this.wordWidth;
	            var lastMask = this.lastMask;
	            var pointerShift = this.pointerShift;
	            var pointerMask = this.pointerMask;
	            var charShift = this.charShift;
	            var charMask = this.charMask;

	            // List of matches found in the search.

	            var matches = [];

	            // Search queue.
	            var queue = [{ pointer: 0, memo: '', depth: 0 }];
	            var lastDepth = string.length;

	            // Do a BFS over nodes for the search query.
	            while (queue.length) {
	                var node = queue.shift();
	                var isLast = node.depth >= lastDepth;
	                var token = isLast ? _constants.TERMINAL : string[node.depth];
	                // Flag for matching anything. Note that the overflow beyond the
	                // length of the query in a prefix search behaves as a wildcard.
	                var isWild = token === wildcard || prefix && isLast;
	                // We're committed to an O(N) scan over the entire node even in
	                // the simple literal-search case, since our structure doesn't
	                // currently guarantee any child ordering.
	                // TODO(joen) ordering is a potential future format optimization.
	                var wordPointer = node.pointer;
	                while (true) {
	                    // Optimization: Exit immediately if the char was not found in
	                    // the table (meaning there can't be any children in the trie
	                    // with this character). Exception is wildcards.
	                    if (!isWild && !table.hasOwnProperty(token)) {
	                        break;
	                    }

	                    var bits = wordPointer * wordWidth;
	                    var chunk = readBits(data, bits, wordWidth);

	                    // Read the character index
	                    var charIdx = chunk >> charShift & charMask;

	                    // If this character is matched, jump to the pointer given in
	                    // this node.
	                    if (isWild || charIdx === table[token]) {
	                        var pointer = chunk >> pointerShift & pointerMask;
	                        // Find the next char with an inverse map, since we might
	                        // be using a wildcard search.
	                        var newChar = inverseTable[charIdx];
	                        // Stopping condition: searching last block and we hit a terminal
	                        if (isLast && newChar === _constants.TERMINAL) {
	                            // Optimization: early exit if we only need first match.
	                            if (first) {
	                                return node.memo;
	                            }
	                            // Store this match.
	                            matches.push(node.memo);
	                            // If we're not matching everything, break out of the
	                            // inner loop.
	                            if (!isWild) {
	                                break;
	                            }
	                        }

	                        // Push next node for search, if it's non-terminal.
	                        if (newChar !== _constants.TERMINAL) {
	                            queue.push({
	                                pointer: wordPointer + offset + pointer,
	                                depth: node.depth + 1,
	                                memo: node.memo + newChar
	                            });
	                        }
	                    }

	                    // If this wasn't a match, check if this was the last key in
	                    // the block.
	                    var last = chunk & lastMask;

	                    // If this was the last node, the word was not found.
	                    if (last) {
	                        break;
	                    }
	                    // Otherwise increment the pointer to the next sibling key
	                    else {
	                            wordPointer += 1;
	                        }
	                }
	            }

	            // If first was requested it should have returned by now. Otherwise
	            // return the matches list, which may be empty.
	            return first ? null : matches;
	        }
	    }]);

	    return PackedTrie;
	})();

	exports.default = PackedTrie;

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

/***/ }
/******/ ])
});
;