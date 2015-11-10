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

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(1);

	var _constants = __webpack_require__(2);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// TODO
	// Rewrite as a native class. Babel adds a ton of overhead. This file should
	// be under 1kb.

	/**
	 * Class for interacting with an encoded trie. The class performs lookups
	 * virtually just as fast as a regular trie. The binary data never actually
	 * have to be processed as a whole, so instantiation time and memory usage are
	 * phenomenally low.
	 */

	var PackedTrie = (function () {
	  function PackedTrie(trieJson) {
	    _classCallCheck(this, PackedTrie);

	    var _trieJson$dimensions = _slicedToArray(trieJson.dimensions, 2);

	    var charWidth = _trieJson$dimensions[0];
	    var pointerWidth = _trieJson$dimensions[1];

	    /**
	     * Character table, mapping character to an integer ID
	     * @type {Object}
	     */

	    this.table = trieJson.table.split('').reduce(function (agg, char, i) {
	      agg[char] = i + 1;
	      return agg;
	    }, _defineProperty({}, _constants.TERMINAL, 0));

	    /**
	     * Pointer offset. Add this to every pointer read from every word in
	     * the trie to obtain the true value of the pointer. This offset is
	     * used to avoid signed integers in the word.
	     * @type {Number}
	     */
	    this.offset = trieJson.offset;

	    /**
	     * Binary string encoded as Base64 representing Trie
	     * @type {String}
	     */
	    this.data = trieJson.data;

	    /**
	     * Number of bits in one word
	     * @type {Number}
	     */
	    this.wordWidth = this.charWidth + this.pointerWidth + 1;

	    /**
	     * Maximum length of a chunk of Base64 characters that's needed to
	     * view the word. The exact chunk length needed could be determined
	     * dynamically on a case-by-case basis. A more clever strategy might
	     * be necessary when pushing the limits of wide chartables and long
	     * word lists.
	     * @type {Number}
	     */
	    this.chunkLen = Math.ceil(this.wordWidth / 6) + 1;

	    /**
	     * Mask for reading the "last block" flag in a word
	     * @type {Number}
	     */
	    this.lastMask = 0x1;

	    /**
	     * Mask for reading the pointer value from a word
	     * @type {Number}
	     */
	    this.pointerMask = 0x1 << pointerWidth;

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
	     * @type {[type]}
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
	      var chunkLen = this.chunkLen;
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
	          if (!queryCharId) {
	            return false;
	          }

	          var bits = wordPointer * wordWidth;
	          var chunkIdx = ~ ~(bits / 6);
	          var chunkOffset = bits % 6;
	          var chunk = 0;

	          // Interpret each char as Base64
	          // TODO buffering here to prevent overflows
	          for (var i = 0; i < chunkLen; i++) {
	            chunk <<= 6;
	            chunk |= _base.BASE64_CHAR_TO_INT[data[i + chunkIdx]];
	          }

	          // Align the word on the right edge of the chunk
	          chunk >>= 6 * chunkLen - wordWidth - chunkOffset;

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
	 * Lookup table for transforming a 6-bit binary integer into a Base-64 ASCII
	 * character.
	 * @type {String[]}
	 */
	var BASE64_INT_TO_CHAR = exports.BASE64_INT_TO_CHAR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

	/**
	 * Inverse lookup table for transformating a Base-64 ASCII character into the
	 * corresponding integer value.
	 * @type {Object}
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
	 * String terminal character
	 * @type {String}
	 */
	var TERMINAL = exports.TERMINAL = '\0';

	/**
	 * Terminal edge
	 * @type {Object}
	 */
	var TERMINUS = exports.TERMINUS = Object.create(null);

/***/ }
/******/ ])
});
;