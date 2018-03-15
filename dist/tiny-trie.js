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
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib sync recursive":
/*!******************!*\
  !*** ./lib sync ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function webpackEmptyContext(req) {\n\tvar e = new Error('Cannot find module \"' + req + '\".');\n\te.code = 'MODULE_NOT_FOUND';\n\tthrow e;\n}\nwebpackEmptyContext.keys = function() { return []; };\nwebpackEmptyContext.resolve = webpackEmptyContext;\nmodule.exports = webpackEmptyContext;\nwebpackEmptyContext.id = \"./lib sync recursive\";\n\n//# sourceURL=webpack://TinyTrie/./lib_sync?");

/***/ }),

/***/ "./lib/BinaryString.ts":
/*!*****************************!*\
  !*** ./lib/BinaryString.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n(function (factory) {\n    if (( false ? undefined : _typeof(module)) === \"object\" && _typeof(module.exports) === \"object\") {\n        var v = factory(__webpack_require__(\"./lib sync recursive\"), exports);\n        if (v !== undefined) module.exports = v;\n    } else if (true) {\n        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ./floor_log2 */ \"./lib/floor_log2.ts\"), __webpack_require__(/*! ./base64 */ \"./lib/base64.ts\")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?\n\t\t\t\t(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n    }\n})(function (require, exports) {\n    \"use strict\";\n\n    Object.defineProperty(exports, \"__esModule\", { value: true });\n    var floor_log2_1 = require(\"./floor_log2\");\n    var base64_1 = require(\"./base64\");\n\n    var BinaryString = function () {\n        function BinaryString() {\n            _classCallCheck(this, BinaryString);\n\n            this.buffer = 0;\n            this.pointer = 0;\n            this.data = '';\n        }\n\n        _createClass(BinaryString, [{\n            key: \"write\",\n            value: function write(val) {\n                var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;\n\n                var buf = this.buffer;\n                var len = width || floor_log2_1.default(val) + 1;\n                if (width && val >= 0x1 << width) {\n                    throw new Error(\"Can't write \" + val + \" in only \" + width + \" bits\");\n                }\n                this.buffer = buf << len | val;\n                this.pointer += len;\n                this._digest();\n            }\n        }, {\n            key: \"flush\",\n            value: function flush() {\n                var buffer = this.buffer;\n                var pointer = this.pointer;\n                while (pointer && pointer < 6) {\n                    buffer <<= 1;\n                    pointer += 1;\n                }\n                this.pointer = pointer;\n                this.buffer = buffer;\n                this._digest();\n            }\n        }, {\n            key: \"getData\",\n            value: function getData() {\n                this.flush();\n                return this.data;\n            }\n        }, {\n            key: \"_digest\",\n            value: function _digest() {\n                var buffer = this.buffer;\n                var pointer = this.pointer;\n                var newData = '';\n                while (pointer >= 6) {\n                    var remainder = pointer - 6;\n                    var code = buffer >> remainder;\n                    buffer = buffer ^ code << remainder;\n                    pointer = remainder;\n                    newData += base64_1.BASE64_INT_TO_CHAR[code];\n                }\n                this.pointer = pointer;\n                this.buffer = buffer;\n                this.data += newData;\n            }\n        }]);\n\n        return BinaryString;\n    }();\n\n    exports.default = BinaryString;\n});\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/module.js */ \"./node_modules/webpack/buildin/module.js\")(module)))\n\n//# sourceURL=webpack://TinyTrie/./lib/BinaryString.ts?");

/***/ }),

/***/ "./lib/Trie.ts":
/*!*********************!*\
  !*** ./lib/Trie.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n(function (factory) {\n    if (( false ? undefined : _typeof(module)) === \"object\" && _typeof(module.exports) === \"object\") {\n        var v = factory(__webpack_require__(\"./lib sync recursive\"), exports);\n        if (v !== undefined) module.exports = v;\n    } else if (true) {\n        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ./floor_log2 */ \"./lib/floor_log2.ts\"), __webpack_require__(/*! ./BinaryString */ \"./lib/BinaryString.ts\"), __webpack_require__(/*! ./constants */ \"./lib/constants.ts\")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?\n\t\t\t\t(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n    }\n})(function (require, exports) {\n    \"use strict\";\n\n    Object.defineProperty(exports, \"__esModule\", { value: true });\n    var floor_log2_1 = require(\"./floor_log2\");\n    var BinaryString_1 = require(\"./BinaryString\");\n    var constants_1 = require(\"./constants\");\n\n    var Trie = function () {\n        function Trie() {\n            var tree = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n\n            _classCallCheck(this, Trie);\n\n            this.root = tree;\n            this.frozen = false;\n        }\n\n        _createClass(Trie, [{\n            key: \"insert\",\n            value: function insert(str) {\n                if (this.frozen) {\n                    throw new SyntaxError(\"Can't insert into frozen Trie\");\n                }\n                var lastNode = str.split('').reduce(function (node, char) {\n                    if (char === constants_1.TERMINAL) {\n                        throw new TypeError(\"Illegal string character \" + constants_1.TERMINAL);\n                    }\n                    var nextNode = node.hasOwnProperty(char) ? node[char] : node[char] = {};\n                    return nextNode;\n                }, this.root);\n                lastNode[constants_1.TERMINAL] = constants_1.TERMINUS;\n                return this;\n            }\n        }, {\n            key: \"test\",\n            value: function test(str) {\n                var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { wildcard: null, prefix: false },\n                    wildcard = _ref.wildcard,\n                    prefix = _ref.prefix;\n\n                if (!wildcard) {\n                    var node = this.root;\n                    var match = str.split('').every(function (char) {\n                        return !!(node = node[char]);\n                    });\n                    return !!match && (prefix || node.hasOwnProperty(constants_1.TERMINAL));\n                }\n                return !!this.search(str, { wildcard: wildcard, prefix: prefix, first: true });\n            }\n        }, {\n            key: \"search\",\n            value: function search(str) {\n                var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { wildcard: null, prefix: false, first: false },\n                    wildcard = _ref2.wildcard,\n                    prefix = _ref2.prefix,\n                    first = _ref2.first;\n\n                if (wildcard && wildcard.length !== 1) {\n                    throw new Error(\"Wildcard length must be 1; got \" + wildcard.length);\n                }\n                var matches = [];\n                var queue = [{ data: this.root, depth: 0, memo: '' }];\n                var lastDepth = str.length;\n\n                var _loop = function _loop() {\n                    var node = queue.shift();\n                    if (node.depth >= lastDepth) {\n                        if (node.data.hasOwnProperty(constants_1.TERMINAL)) {\n                            if (first) {\n                                return {\n                                    v: node.memo\n                                };\n                            }\n                            matches.push(node.memo);\n                        }\n                        if (!prefix) {\n                            return \"continue\";\n                        }\n                    }\n                    var isPfXOverflow = prefix && node.depth >= lastDepth;\n                    var token = str[node.depth];\n                    if (token === wildcard || isPfXOverflow) {\n                        Object.keys(node.data).forEach(function (n) {\n                            if (n !== constants_1.TERMINAL) {\n                                queue.push({\n                                    data: node.data[n],\n                                    depth: node.depth + 1,\n                                    memo: node.memo + n\n                                });\n                            }\n                        });\n                    } else {\n                        if (node.data.hasOwnProperty(token)) {\n                            queue.push({\n                                data: node.data[token],\n                                depth: node.depth + 1,\n                                memo: node.memo + token\n                            });\n                        }\n                    }\n                };\n\n                while (queue.length) {\n                    var _ret = _loop();\n\n                    switch (_ret) {\n                        case \"continue\":\n                            continue;\n\n                        default:\n                            if ((typeof _ret === \"undefined\" ? \"undefined\" : _typeof(_ret)) === \"object\") return _ret.v;\n                    }\n                }\n                return first ? null : matches;\n            }\n        }, {\n            key: \"clone\",\n            value: function clone() {\n                return new Trie(this.toJSON());\n            }\n        }, {\n            key: \"freeze\",\n            value: function freeze() {\n                if (this.frozen) {\n                    return this;\n                }\n                var suffixTree = {};\n                var node = this.root;\n                var stack = [];\n                var depthStack = [node];\n                while (depthStack.length) {\n                    node = depthStack.pop();\n                    Object.keys(node).forEach(function (char) {\n                        if (char[1] === '_') {\n                            return;\n                        }\n                        var current = node[char];\n                        stack.push({\n                            current: current,\n                            char: char,\n                            parent: node\n                        });\n                        depthStack.push(current);\n                    });\n                }\n\n                var _loop2 = function _loop2() {\n                    var _stack$pop = stack.pop(),\n                        char = _stack$pop.char,\n                        parent = _stack$pop.parent,\n                        current = _stack$pop.current;\n\n                    if (suffixTree.hasOwnProperty(char)) {\n                        var suffixMeta = suffixTree[char];\n                        var match = suffixMeta.find(function (other) {\n                            var oKeys = Object.keys(other);\n                            var cKeys = Object.keys(current);\n                            return oKeys.length === cKeys.length && oKeys.every(function (key) {\n                                return other[key] === current[key];\n                            });\n                        });\n                        if (match) {\n                            parent[char] = match;\n                        } else {\n                            suffixMeta.push(current);\n                        }\n                    } else {\n                        suffixTree[char] = [current];\n                    }\n                };\n\n                while (stack.length) {\n                    _loop2();\n                }\n                this.frozen = true;\n                return this;\n            }\n        }, {\n            key: \"encode\",\n            value: function encode() {\n                var chunks = [];\n                var queue = [this.root];\n                var charTable = new Set();\n                var visitCode = Date.now();\n                var offsetMin = Infinity;\n                var offsetMax = -Infinity;\n\n                var _loop3 = function _loop3() {\n                    var node = queue.shift();\n                    var keys = Object.keys(node).filter(function (k) {\n                        return k[1] !== '_';\n                    });\n                    var n = keys.length;\n                    node.__visited__ = visitCode;\n                    var nodeChunkIndex = node.__idx__ = chunks.length;\n                    if (node.__parents__) {\n                        node.__parents__.forEach(function (chunk) {\n                            var offset = chunk.offset = nodeChunkIndex - chunk.idx;\n                            if (offset < offsetMin) {\n                                offsetMin = offset;\n                            }\n                            if (offset > offsetMax) {\n                                offsetMax = offset;\n                            }\n                        });\n                    }\n                    keys.forEach(function (char, i) {\n                        var child = node[char];\n                        var chunkIdx = chunks.length;\n                        var lastInLevel = i === n - 1;\n                        var newChunk = {\n                            char: char,\n                            idx: chunkIdx,\n                            offset: null,\n                            last: lastInLevel\n                        };\n                        if (child.__visited__ === visitCode) {\n                            var idx = child.__idx__;\n                            var offset = newChunk.offset = idx - chunkIdx;\n                            if (offset < offsetMin) {\n                                offsetMin = offset;\n                            }\n                            if (offset > offsetMax) {\n                                offsetMax = offset;\n                            }\n                        } else {\n                            if (child.__willVisit__ === visitCode) {\n                                child.__parents__.push(newChunk);\n                            } else {\n                                child.__willVisit__ = visitCode;\n                                child.__parents__ = [newChunk];\n                            }\n                            queue.push(child);\n                        }\n                        chunks.push(newChunk);\n                        charTable.add(char);\n                    });\n                };\n\n                while (queue.length) {\n                    _loop3();\n                }\n                var charTableAsArray = Array.from(charTable).filter(function (char) {\n                    return char !== constants_1.TERMINAL;\n                });\n                var charMap = charTableAsArray.reduce(function (agg, char, i) {\n                    agg[char] = i + 1;\n                    return agg;\n                }, _defineProperty({}, constants_1.TERMINAL, 0));\n                var charEncodingWidth = floor_log2_1.default(charTableAsArray.length) + 1;\n                var pointerRange = offsetMax - offsetMin;\n                var pointerEncodingWidth = floor_log2_1.default(pointerRange) + 1;\n                var encodedTrie = new BinaryString_1.default();\n                chunks.forEach(function (chunk) {\n                    var char = chunk.char,\n                        offset = chunk.offset,\n                        last = chunk.last;\n\n                    encodedTrie.write(charMap[char], charEncodingWidth);\n                    encodedTrie.write(offset - offsetMin, pointerEncodingWidth);\n                    encodedTrie.write(+last, 1);\n                });\n                encodedTrie.flush();\n                var headerString = new BinaryString_1.default();\n                var outputCharTable = charTableAsArray.join('');\n                var headerWidth = Math.ceil((constants_1.HEADER_WIDTH_FIELD + constants_1.VERSION_FIELD + constants_1.OFFSET_SIGN_FIELD + constants_1.OFFSET_VAL_FIELD + constants_1.CHAR_WIDTH_FIELD + constants_1.POINTER_WIDTH_FIELD) / 6) + outputCharTable.length;\n                var offsetSign = +(offsetMin < 0);\n                headerString.write(headerWidth, constants_1.HEADER_WIDTH_FIELD);\n                headerString.write(constants_1.VERSION, constants_1.VERSION_FIELD);\n                headerString.write(offsetSign, constants_1.OFFSET_SIGN_FIELD);\n                headerString.write(offsetSign ? -offsetMin : offsetMin, constants_1.OFFSET_VAL_FIELD);\n                headerString.write(charEncodingWidth, constants_1.CHAR_WIDTH_FIELD);\n                headerString.write(pointerEncodingWidth, constants_1.POINTER_WIDTH_FIELD);\n                headerString.flush();\n                return \"\" + headerString.getData() + outputCharTable + encodedTrie.getData();\n            }\n        }, {\n            key: \"toJSON\",\n            value: function toJSON() {\n                var str = JSON.stringify(this.root, function (k, v) {\n                    if (k[1] === '_') {\n                        return undefined;\n                    }\n                    return v;\n                });\n                return JSON.parse(str);\n            }\n        }]);\n\n        return Trie;\n    }();\n\n    exports.default = Trie;\n});\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/module.js */ \"./node_modules/webpack/buildin/module.js\")(module)))\n\n//# sourceURL=webpack://TinyTrie/./lib/Trie.ts?");

/***/ }),

/***/ "./lib/base64.ts":
/*!***********************!*\
  !*** ./lib/base64.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\n(function (factory) {\n    if (( false ? undefined : _typeof(module)) === \"object\" && _typeof(module.exports) === \"object\") {\n        var v = factory(__webpack_require__(\"./lib sync recursive\"), exports);\n        if (v !== undefined) module.exports = v;\n    } else if (true) {\n        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?\n\t\t\t\t(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n    }\n})(function (require, exports) {\n    \"use strict\";\n\n    Object.defineProperty(exports, \"__esModule\", { value: true });\n    exports.BASE64_INT_TO_CHAR = \"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\".split('');\n    exports.BASE64_CHAR_TO_INT = exports.BASE64_INT_TO_CHAR.reduce(function (agg, char, i) {\n        agg[char] = i;\n        return agg;\n    }, {});\n});\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/module.js */ \"./node_modules/webpack/buildin/module.js\")(module)))\n\n//# sourceURL=webpack://TinyTrie/./lib/base64.ts?");

/***/ }),

/***/ "./lib/constants.ts":
/*!**************************!*\
  !*** ./lib/constants.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\n(function (factory) {\n    if (( false ? undefined : _typeof(module)) === \"object\" && _typeof(module.exports) === \"object\") {\n        var v = factory(__webpack_require__(\"./lib sync recursive\"), exports);\n        if (v !== undefined) module.exports = v;\n    } else if (true) {\n        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?\n\t\t\t\t(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n    }\n})(function (require, exports) {\n    \"use strict\";\n\n    Object.defineProperty(exports, \"__esModule\", { value: true });\n    exports.TERMINAL = '\\0';\n    exports.TERMINUS = Object.create(null);\n    exports.VERSION = 0;\n    exports.HEADER_WIDTH_FIELD = 10;\n    exports.VERSION_FIELD = 10;\n    exports.OFFSET_SIGN_FIELD = 1;\n    exports.OFFSET_VAL_FIELD = 21;\n    exports.CHAR_WIDTH_FIELD = 8;\n    exports.POINTER_WIDTH_FIELD = 8;\n});\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/module.js */ \"./node_modules/webpack/buildin/module.js\")(module)))\n\n//# sourceURL=webpack://TinyTrie/./lib/constants.ts?");

/***/ }),

/***/ "./lib/floor_log2.ts":
/*!***************************!*\
  !*** ./lib/floor_log2.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\n(function (factory) {\n    if (( false ? undefined : _typeof(module)) === \"object\" && _typeof(module.exports) === \"object\") {\n        var v = factory(__webpack_require__(\"./lib sync recursive\"), exports);\n        if (v !== undefined) module.exports = v;\n    } else if (true) {\n        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?\n\t\t\t\t(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n    }\n})(function (require, exports) {\n    \"use strict\";\n\n    Object.defineProperty(exports, \"__esModule\", { value: true });\n    function floor_log2(x) {\n        var n = 0;\n        while (x >>= 1) {\n            n++;\n        }\n        return n;\n    }\n    exports.default = floor_log2;\n});\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/module.js */ \"./node_modules/webpack/buildin/module.js\")(module)))\n\n//# sourceURL=webpack://TinyTrie/./lib/floor_log2.ts?");

/***/ }),

/***/ "./lib/index.ts":
/*!**********************!*\
  !*** ./lib/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\n(function (factory) {\n    if (( false ? undefined : _typeof(module)) === \"object\" && _typeof(module.exports) === \"object\") {\n        var v = factory(__webpack_require__(\"./lib sync recursive\"), exports);\n        if (v !== undefined) module.exports = v;\n    } else if (true) {\n        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ./Trie */ \"./lib/Trie.ts\"), __webpack_require__(/*! ./Trie */ \"./lib/Trie.ts\")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?\n\t\t\t\t(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n    }\n})(function (require, exports) {\n    \"use strict\";\n\n    Object.defineProperty(exports, \"__esModule\", { value: true });\n    var Trie_1 = require(\"./Trie\");\n    var Trie_2 = require(\"./Trie\");\n    exports.Trie = Trie_2.default;\n    function createSync(strings) {\n        var trie = new Trie_1.default();\n        strings.forEach(function (s) {\n            return trie.insert(s);\n        });\n        return trie;\n    }\n    exports.createSync = createSync;\n    function createFrozenSync(words) {\n        return createSync(words).freeze();\n    }\n    exports.createFrozenSync = createFrozenSync;\n});\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/module.js */ \"./node_modules/webpack/buildin/module.js\")(module)))\n\n//# sourceURL=webpack://TinyTrie/./lib/index.ts?");

/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function(module) {\r\n\tif (!module.webpackPolyfill) {\r\n\t\tmodule.deprecate = function() {};\r\n\t\tmodule.paths = [];\r\n\t\t// module.parent = undefined by default\r\n\t\tif (!module.children) module.children = [];\r\n\t\tObject.defineProperty(module, \"loaded\", {\r\n\t\t\tenumerable: true,\r\n\t\t\tget: function() {\r\n\t\t\t\treturn module.l;\r\n\t\t\t}\r\n\t\t});\r\n\t\tObject.defineProperty(module, \"id\", {\r\n\t\t\tenumerable: true,\r\n\t\t\tget: function() {\r\n\t\t\t\treturn module.i;\r\n\t\t\t}\r\n\t\t});\r\n\t\tmodule.webpackPolyfill = 1;\r\n\t}\r\n\treturn module;\r\n};\r\n\n\n//# sourceURL=webpack://TinyTrie/(webpack)/buildin/module.js?");

/***/ })

/******/ });
});