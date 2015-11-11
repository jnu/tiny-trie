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

	        // Split binary into header and content by checking first field
	        var headerCharCount = readBits(binary, 0, _constants.HEADER_WIDTH_FIELD);
	        var header = binary.substr(0, headerCharCount);

	        /**
	         * Binary string encoded as Base64 representing Trie
	         * @type {String}
	         */
	        this.data = binary.substr(headerCharCount);

	        // compute pointer offset
	        var offsetSign = readBits(header, _constants.HEADER_WIDTH_FIELD, _constants.OFFSET_SIGN_FIELD);
	        var offset = readBits(header, _constants.HEADER_WIDTH_FIELD + _constants.OFFSET_SIGN_FIELD, _constants.OFFSET_VAL_FIELD);

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
	        var charWidth = readBits(header, _constants.HEADER_WIDTH_FIELD + _constants.OFFSET_SIGN_FIELD + _constants.OFFSET_VAL_FIELD, _constants.CHAR_WIDTH_FIELD);

	        var pointerWidth = readBits(header, _constants.HEADER_WIDTH_FIELD + _constants.OFFSET_SIGN_FIELD + _constants.OFFSET_VAL_FIELD + _constants.CHAR_WIDTH_FIELD, _constants.POINTER_WIDTH_FIELD, true);

	        // Interpret the rest of the header as the charTable
	        var headerFieldWidth = Math.ceil((_constants.HEADER_WIDTH_FIELD + _constants.OFFSET_SIGN_FIELD + _constants.OFFSET_VAL_FIELD + _constants.CHAR_WIDTH_FIELD + _constants.POINTER_WIDTH_FIELD) / 6);
	        var charTable = header.substr(headerFieldWidth);

	        /**
	         * Character table, mapping character to an integer ID
	         * @type {Object}
	         */
	        this.table = charTable.split('').reduce(function (agg, char, i) {
	            agg[char] = i + 1;
	            return agg;
	        }, _defineProperty({}, _constants.TERMINAL, 0));

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
	     * Test whether trie contains the given string.
	     * @param  {String} string
	     * @return {Boolean}
	     */

	    _createClass(PackedTrie, [{
	        key: 'test',
	        value: function test(string) {
	            var data = this.data;
	            var offset = this.offset;
	            var table = this.table;
	            var wordWidth = this.wordWidth;
	            var lastMask = this.lastMask;
	            var pointerShift = this.pointerShift;
	            var pointerMask = this.pointerMask;
	            var charShift = this.charShift;
	            var charMask = this.charMask;

	            var wordPointer = 0;

	            // Test every character, with a terminal at the end
	            var match = string.split('').concat(_constants.TERMINAL).every(function (char) {
	                // TODO is binary search possible within blocks? Not sure if the
	                // encoder guarantees ordering, plus there's no indication how long
	                // a block is, so it'd require extra overhead for each block.
	                while (true) {
	                    var queryCharId = table[char];

	                    // Exit immediately if the char was not found in the table,
	                    // (or if it was the TERMINAL character, which has a code of 0)
	                    if (queryCharId === undefined) {
	                        return false;
	                    }

	                    var bits = wordPointer * wordWidth;
	                    var chunk = readBits(data, bits, wordWidth);

	                    // Read the character index
	                    var charIdx = chunk >> charShift & charMask;

	                    // If this character is matched, jump to the pointer given in
	                    // this node.
	                    if (charIdx === queryCharId) {
	                        var pointer = chunk >> pointerShift & pointerMask;
	                        wordPointer += offset + pointer;
	                        return true;
	                    }

	                    // If this wasn't a match, check if this was the last key in
	                    // the block.
	                    var last = chunk & lastMask;

	                    // If this was the last node, the word was not found.
	                    if (last) {
	                        return false;
	                    }
	                    // Otherwise increment the pointer to the next sibling key
	                    else {
	                            wordPointer += 1;
	                        }
	                }
	            });

	            return match;
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
	 * Width of header field storing entire header width (including char table).
	 * Value is given in Base64 characters (i.e., every six bits)
	 * @constant {Number}
	 */
	var HEADER_WIDTH_FIELD = exports.HEADER_WIDTH_FIELD = 10;

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