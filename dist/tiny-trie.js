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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/BinaryString.ts":
/*!*****************************!*\
  !*** ./src/BinaryString.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var floor_log2_1 = __webpack_require__(/*! ./floor_log2 */ "./src/floor_log2.ts");
var base64_1 = __webpack_require__(/*! ./base64 */ "./src/base64.ts");

var BinaryString = function () {
    function BinaryString() {
        _classCallCheck(this, BinaryString);

        this.buffer = 0;
        this.pointer = 0;
        this.data = '';
    }

    _createClass(BinaryString, [{
        key: "write",
        value: function write(val) {
            var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var buf = this.buffer;
            var len = width || floor_log2_1.floor_log2(val) + 1;
            if (width && val >= 0x1 << width) {
                throw new Error("Can't write " + val + " in only " + width + " bits");
            }
            this.buffer = buf << len | val;
            this.pointer += len;
            this._digest();
        }
    }, {
        key: "flush",
        value: function flush() {
            var buffer = this.buffer;
            var pointer = this.pointer;
            while (pointer && pointer < 6) {
                buffer <<= 1;
                pointer += 1;
            }
            this.pointer = pointer;
            this.buffer = buffer;
            this._digest();
        }
    }, {
        key: "getData",
        value: function getData() {
            this.flush();
            return this.data;
        }
    }, {
        key: "_digest",
        value: function _digest() {
            var buffer = this.buffer;
            var pointer = this.pointer;
            var newData = '';
            while (pointer >= 6) {
                var remainder = pointer - 6;
                var code = buffer >> remainder;
                buffer = buffer ^ code << remainder;
                pointer = remainder;
                newData += base64_1.BASE64_INT_TO_CHAR[code];
            }
            this.pointer = pointer;
            this.buffer = buffer;
            this.data += newData;
        }
    }]);

    return BinaryString;
}();

exports.BinaryString = BinaryString;

/***/ }),

/***/ "./src/Trie.ts":
/*!*********************!*\
  !*** ./src/Trie.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var floor_log2_1 = __webpack_require__(/*! ./floor_log2 */ "./src/floor_log2.ts");
var BinaryString_1 = __webpack_require__(/*! ./BinaryString */ "./src/BinaryString.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./src/constants.ts");

var Trie = function () {
    function Trie() {
        var tree = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Trie);

        this.root = tree;
        this.frozen = false;
    }

    _createClass(Trie, [{
        key: "insert",
        value: function insert(str) {
            if (this.frozen) {
                throw new SyntaxError("Can't insert into frozen Trie");
            }
            var lastNode = str.split('').reduce(function (node, char) {
                if (char === constants_1.TERMINAL) {
                    throw new TypeError("Illegal string character " + constants_1.TERMINAL);
                }
                var nextNode = node.hasOwnProperty(char) ? node[char] : node[char] = {};
                return nextNode;
            }, this.root);
            lastNode[constants_1.TERMINAL] = constants_1.TERMINUS;
            return this;
        }
    }, {
        key: "test",
        value: function test(str) {
            var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { wildcard: null, prefix: false },
                wildcard = _ref.wildcard,
                prefix = _ref.prefix;

            if (!wildcard) {
                var node = this.root;
                var match = str.split('').every(function (char) {
                    return !!(node = node[char]);
                });
                return !!match && (prefix || node.hasOwnProperty(constants_1.TERMINAL));
            }
            return !!this.search(str, { wildcard: wildcard, prefix: prefix, first: true });
        }
    }, {
        key: "search",
        value: function search(str) {
            var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { wildcard: null, prefix: false, first: false },
                wildcard = _ref2.wildcard,
                prefix = _ref2.prefix,
                first = _ref2.first;

            if (wildcard && wildcard.length !== 1) {
                throw new Error("Wildcard length must be 1; got " + wildcard.length);
            }
            var matches = [];
            var queue = [{ data: this.root, depth: 0, memo: '' }];
            var lastDepth = str.length;

            var _loop = function _loop() {
                var node = queue.shift();
                if (node.depth >= lastDepth) {
                    if (node.data.hasOwnProperty(constants_1.TERMINAL)) {
                        if (first) {
                            return {
                                v: node.memo
                            };
                        }
                        matches.push(node.memo);
                    }
                    if (!prefix) {
                        return "continue";
                    }
                }
                var isPfXOverflow = prefix && node.depth >= lastDepth;
                var token = str[node.depth];
                if (token === wildcard || isPfXOverflow) {
                    Object.keys(node.data).forEach(function (n) {
                        if (n !== constants_1.TERMINAL) {
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
            };

            while (queue.length) {
                var _ret = _loop();

                switch (_ret) {
                    case "continue":
                        continue;

                    default:
                        if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
                }
            }
            return first ? null : matches;
        }
    }, {
        key: "clone",
        value: function clone() {
            return new Trie(this.toJSON());
        }
    }, {
        key: "freeze",
        value: function freeze() {
            if (this.frozen) {
                return this;
            }
            var suffixTree = {};
            var node = this.root;
            var stack = [];
            var depthStack = [node];
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

            var _loop2 = function _loop2() {
                var _stack$pop = stack.pop(),
                    char = _stack$pop.char,
                    parent = _stack$pop.parent,
                    current = _stack$pop.current;

                if (suffixTree.hasOwnProperty(char)) {
                    var suffixMeta = suffixTree[char];
                    var match = suffixMeta.find(function (other) {
                        var oKeys = Object.keys(other);
                        var cKeys = Object.keys(current);
                        return oKeys.length === cKeys.length && oKeys.every(function (key) {
                            return other[key] === current[key];
                        });
                    });
                    if (match) {
                        parent[char] = match;
                    } else {
                        suffixMeta.push(current);
                    }
                } else {
                    suffixTree[char] = [current];
                }
            };

            while (stack.length) {
                _loop2();
            }
            this.frozen = true;
            return this;
        }
    }, {
        key: "encode",
        value: function encode() {
            var chunks = [];
            var queue = [this.root];
            var charTable = new Set();
            var visitCode = Date.now();
            var offsetMin = Infinity;
            var offsetMax = -Infinity;

            var _loop3 = function _loop3() {
                var node = queue.shift();
                var keys = Object.keys(node).filter(function (k) {
                    return k[1] !== '_';
                });
                var n = keys.length;
                node.__visited__ = visitCode;
                var nodeChunkIndex = node.__idx__ = chunks.length;
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
                    if (child.__visited__ === visitCode) {
                        var idx = child.__idx__;
                        var offset = newChunk.offset = idx - chunkIdx;
                        if (offset < offsetMin) {
                            offsetMin = offset;
                        }
                        if (offset > offsetMax) {
                            offsetMax = offset;
                        }
                    } else {
                        if (child.__willVisit__ === visitCode) {
                            child.__parents__.push(newChunk);
                        } else {
                            child.__willVisit__ = visitCode;
                            child.__parents__ = [newChunk];
                        }
                        queue.push(child);
                    }
                    chunks.push(newChunk);
                    charTable.add(char);
                });
            };

            while (queue.length) {
                _loop3();
            }
            var charTableAsArray = Array.from(charTable).filter(function (char) {
                return char !== constants_1.TERMINAL;
            });
            var charMap = charTableAsArray.reduce(function (agg, char, i) {
                agg[char] = i + 1;
                return agg;
            }, _defineProperty({}, constants_1.TERMINAL, 0));
            var charEncodingWidth = floor_log2_1.floor_log2(charTableAsArray.length) + 1;
            var pointerRange = offsetMax - offsetMin;
            var pointerEncodingWidth = floor_log2_1.floor_log2(pointerRange) + 1;
            var encodedTrie = new BinaryString_1.BinaryString();
            chunks.forEach(function (chunk) {
                var char = chunk.char,
                    offset = chunk.offset,
                    last = chunk.last;

                encodedTrie.write(charMap[char], charEncodingWidth);
                encodedTrie.write(offset - offsetMin, pointerEncodingWidth);
                encodedTrie.write(+last, 1);
            });
            encodedTrie.flush();
            var headerString = new BinaryString_1.BinaryString();
            var outputCharTable = charTableAsArray.join('');
            var headerWidth = Math.ceil((constants_1.HEADER_WIDTH_FIELD + constants_1.VERSION_FIELD + constants_1.OFFSET_SIGN_FIELD + constants_1.OFFSET_VAL_FIELD + constants_1.CHAR_WIDTH_FIELD + constants_1.POINTER_WIDTH_FIELD) / 6) + outputCharTable.length;
            var offsetSign = +(offsetMin < 0);
            headerString.write(headerWidth, constants_1.HEADER_WIDTH_FIELD);
            headerString.write(constants_1.VERSION, constants_1.VERSION_FIELD);
            headerString.write(offsetSign, constants_1.OFFSET_SIGN_FIELD);
            headerString.write(offsetSign ? -offsetMin : offsetMin, constants_1.OFFSET_VAL_FIELD);
            headerString.write(charEncodingWidth, constants_1.CHAR_WIDTH_FIELD);
            headerString.write(pointerEncodingWidth, constants_1.POINTER_WIDTH_FIELD);
            headerString.flush();
            return "" + headerString.getData() + outputCharTable + encodedTrie.getData();
        }
    }, {
        key: "toJSON",
        value: function toJSON() {
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
}();

exports.Trie = Trie;

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

/***/ }),

/***/ "./src/floor_log2.ts":
/*!***************************!*\
  !*** ./src/floor_log2.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
function floor_log2(x) {
    var n = 0;
    while (x >>= 1) {
        n++;
    }
    return n;
}
exports.floor_log2 = floor_log2;

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var Trie_1 = __webpack_require__(/*! ./Trie */ "./src/Trie.ts");
var Trie_2 = __webpack_require__(/*! ./Trie */ "./src/Trie.ts");
exports.Trie = Trie_2.Trie;
function createSync(strings) {
    var trie = new Trie_1.Trie();
    strings.forEach(function (s) {
        return trie.insert(s);
    });
    return trie;
}
exports.createSync = createSync;
function createFrozenSync(words) {
    return createSync(words).freeze();
}
exports.createFrozenSync = createFrozenSync;

/***/ })

/******/ });
});
//# sourceMappingURL=tiny-trie.js.map