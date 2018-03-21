(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["TinyTrie"] = factory();
	else
		root["TinyTrie"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/PackedTrie.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/PackedTrie.ts":
/*!***************************!*\
  !*** ./src/PackedTrie.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var base64_1 = __webpack_require__(/*! ./base64 */ "./src/base64.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./src/constants.ts");
function readBits(binary, start, len) {
    var startChar = ~~(start / 6);
    var startBitOffset = start % 6;
    var endBit = startBitOffset + len;
    var charLen = Math.ceil(endBit / 6);
    var mask = (0x1 << len) - 1;
    var chunk = 0;
    for (var i = 0; i < charLen; i++) {
        chunk <<= 6;
        chunk |= base64_1.BASE64_CHAR_TO_INT[binary[startChar + i]];
    }
    var rightPadding = endBit % 6;
    if (rightPadding) {
        chunk >>= 6 - rightPadding;
    }
    return chunk & mask;
}

var PackedTrie = function () {
    function PackedTrie(binary) {
        _classCallCheck(this, PackedTrie);

        this.lastMask = 0x1;
        this.pointerShift = 1;
        var ptr = 0;
        var headerCharCount = readBits(binary, ptr, constants_1.HEADER_WIDTH_FIELD);
        ptr += constants_1.HEADER_WIDTH_FIELD;
        var header = binary.substr(0, headerCharCount);
        var version = readBits(binary, ptr, constants_1.VERSION_FIELD);
        ptr += constants_1.VERSION_FIELD;
        if (version !== constants_1.VERSION) {
            throw new Error("Version mismatch! Binary: " + version + ", Reader: " + constants_1.VERSION);
        }
        this.data = binary.substr(headerCharCount);
        var offsetSign = readBits(header, ptr, constants_1.OFFSET_SIGN_FIELD);
        ptr += constants_1.OFFSET_SIGN_FIELD;
        var offset = readBits(header, ptr, constants_1.OFFSET_VAL_FIELD);
        ptr += constants_1.OFFSET_VAL_FIELD;
        if (offsetSign) {
            offset = -offset;
        }
        this.offset = offset;
        var charWidth = readBits(header, ptr, constants_1.CHAR_WIDTH_FIELD);
        ptr += constants_1.CHAR_WIDTH_FIELD;
        var pointerWidth = readBits(header, ptr, constants_1.POINTER_WIDTH_FIELD);
        ptr += constants_1.POINTER_WIDTH_FIELD;
        var headerFieldChars = Math.ceil(ptr / 6);
        var charTable = header.substr(headerFieldChars);
        this.table = charTable.split('').reduce(function (agg, char, i) {
            agg[char] = i + 1;
            return agg;
        }, _defineProperty({}, constants_1.TERMINAL, 0));
        this.inverseTable = [constants_1.TERMINAL].concat(charTable.split(''));
        this.wordWidth = charWidth + pointerWidth + 1;
        this.pointerMask = (0x1 << pointerWidth) - 1;
        this.charMask = (0x1 << charWidth) - 1;
        this.charShift = 1 + pointerWidth;
    }

    _createClass(PackedTrie, [{
        key: "test",
        value: function test(str) {
            var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { wildcard: null, prefix: false },
                wildcard = _ref.wildcard,
                prefix = _ref.prefix;

            return this.search(str, { wildcard: wildcard, prefix: prefix, first: true }) !== null;
        }
    }, {
        key: "search",
        value: function search(str) {
            var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { wildcard: null, prefix: false, first: false },
                wildcard = _ref2.wildcard,
                prefix = _ref2.prefix,
                first = _ref2.first;

            if (wildcard && wildcard.length !== 1) {
                throw new Error("Wilcard must be a single character; got " + wildcard);
            }
            var data = this.data,
                offset = this.offset,
                table = this.table,
                inverseTable = this.inverseTable,
                wordWidth = this.wordWidth,
                lastMask = this.lastMask,
                pointerShift = this.pointerShift,
                pointerMask = this.pointerMask,
                charShift = this.charShift,
                charMask = this.charMask;

            var matches = [];
            var queue = [{ pointer: 0, memo: '', depth: 0 }];
            var lastDepth = str.length;
            while (queue.length) {
                var node = queue.shift();
                var isLast = node.depth >= lastDepth;
                var token = isLast ? constants_1.TERMINAL : str[node.depth];
                var isWild = token === wildcard || prefix && isLast;
                var wordPointer = node.pointer;
                while (true) {
                    if (!isWild && !table.hasOwnProperty(token)) {
                        break;
                    }
                    var bits = wordPointer * wordWidth;
                    var chunk = readBits(data, bits, wordWidth);
                    var charIdx = chunk >> charShift & charMask;
                    if (isWild || charIdx === table[token]) {
                        var pointer = chunk >> pointerShift & pointerMask;
                        var newChar = inverseTable[charIdx];
                        if (isLast && newChar === constants_1.TERMINAL) {
                            if (first) {
                                return node.memo;
                            }
                            matches.push(node.memo);
                            if (!isWild) {
                                break;
                            }
                        }
                        if (newChar !== constants_1.TERMINAL) {
                            queue.push({
                                pointer: wordPointer + offset + pointer,
                                depth: node.depth + 1,
                                memo: node.memo + newChar
                            });
                        }
                    }
                    var last = chunk & lastMask;
                    if (last) {
                        break;
                    } else {
                        wordPointer += 1;
                    }
                }
            }
            return first ? null : matches;
        }
    }]);

    return PackedTrie;
}();

exports.PackedTrie = PackedTrie;

/***/ }),

/***/ "./src/base64.ts":
/*!***********************!*\
  !*** ./src/base64.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
exports.BASE64_INT_TO_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split('');
exports.BASE64_CHAR_TO_INT = exports.BASE64_INT_TO_CHAR.reduce(function (agg, char, i) {
    agg[char] = i;
    return agg;
}, {});

/***/ }),

/***/ "./src/constants.ts":
/*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
exports.TERMINAL = '\0';
exports.TERMINUS = Object.create(null);
exports.VERSION = 0;
exports.HEADER_WIDTH_FIELD = 10;
exports.VERSION_FIELD = 10;
exports.OFFSET_SIGN_FIELD = 1;
exports.OFFSET_VAL_FIELD = 21;
exports.CHAR_WIDTH_FIELD = 8;
exports.POINTER_WIDTH_FIELD = 8;

/***/ })

/******/ });
});
//# sourceMappingURL=packed-trie.js.map