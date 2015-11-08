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
/***/ function(module, exports) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

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
	            (function walk(node) {
	                Object.keys(node).forEach(function (char) {
	                    var current = node[char];
	                    walk(current);

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
	                            node[char] = match;
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
	                });
	            })(this.root);

	            // Flag the tree as frozen
	            this.frozen = true;

	            return this;
	        }
	    }, {
	        key: 'encode',
	        value: function encode() {
	            // TODO
	            throw new Error("Not implemented");
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

/***/ }
/******/ ])
});
;