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

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function(module) {\r\n\tif (!module.webpackPolyfill) {\r\n\t\tmodule.deprecate = function() {};\r\n\t\tmodule.paths = [];\r\n\t\t// module.parent = undefined by default\r\n\t\tif (!module.children) module.children = [];\r\n\t\tObject.defineProperty(module, \"loaded\", {\r\n\t\t\tenumerable: true,\r\n\t\t\tget: function() {\r\n\t\t\t\treturn module.l;\r\n\t\t\t}\r\n\t\t});\r\n\t\tObject.defineProperty(module, \"id\", {\r\n\t\t\tenumerable: true,\r\n\t\t\tget: function() {\r\n\t\t\t\treturn module.i;\r\n\t\t\t}\r\n\t\t});\r\n\t\tmodule.webpackPolyfill = 1;\r\n\t}\r\n\treturn module;\r\n};\r\n\n\n//# sourceURL=webpack://TinyTrie/(webpack)/buildin/module.js?");

/***/ }),

/***/ "./src sync recursive":
/*!******************!*\
  !*** ./src sync ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function webpackEmptyContext(req) {\n\tvar e = new Error('Cannot find module \"' + req + '\".');\n\te.code = 'MODULE_NOT_FOUND';\n\tthrow e;\n}\nwebpackEmptyContext.keys = function() { return []; };\nwebpackEmptyContext.resolve = webpackEmptyContext;\nmodule.exports = webpackEmptyContext;\nwebpackEmptyContext.id = \"./src sync recursive\";\n\n//# sourceURL=webpack://TinyTrie/./src_sync?");

/***/ }),

/***/ "./src/PackedTrie.ts":
/*!***************************!*\
  !*** ./src/PackedTrie.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n(function (factory) {\n    if (( false ? undefined : _typeof(module)) === \"object\" && _typeof(module.exports) === \"object\") {\n        var v = factory(__webpack_require__(\"./src sync recursive\"), exports);\n        if (v !== undefined) module.exports = v;\n    } else if (true) {\n        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ./base64 */ \"./src/base64.ts\"), __webpack_require__(/*! ./constants */ \"./src/constants.ts\")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?\n\t\t\t\t(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n    }\n})(function (require, exports) {\n    \"use strict\";\n\n    Object.defineProperty(exports, \"__esModule\", { value: true });\n    var base64_1 = require(\"./base64\");\n    var constants_1 = require(\"./constants\");\n    function readBits(binary, start, len) {\n        var startChar = ~~(start / 6);\n        var startBitOffset = start % 6;\n        var endBit = startBitOffset + len;\n        var charLen = Math.ceil(endBit / 6);\n        var mask = (0x1 << len) - 1;\n        var chunk = 0;\n        for (var i = 0; i < charLen; i++) {\n            chunk <<= 6;\n            chunk |= base64_1.BASE64_CHAR_TO_INT[binary[startChar + i]];\n        }\n        var rightPadding = endBit % 6;\n        if (rightPadding) {\n            chunk >>= 6 - rightPadding;\n        }\n        return chunk & mask;\n    }\n\n    var PackedTrie = function () {\n        function PackedTrie(binary) {\n            _classCallCheck(this, PackedTrie);\n\n            this.lastMask = 0x1;\n            this.pointerShift = 1;\n            var ptr = 0;\n            var headerCharCount = readBits(binary, ptr, constants_1.HEADER_WIDTH_FIELD);\n            ptr += constants_1.HEADER_WIDTH_FIELD;\n            var header = binary.substr(0, headerCharCount);\n            var version = readBits(binary, ptr, constants_1.VERSION_FIELD);\n            ptr += constants_1.VERSION_FIELD;\n            if (version !== constants_1.VERSION) {\n                throw new Error(\"Version mismatch! Binary: \" + version + \", Reader: \" + constants_1.VERSION);\n            }\n            this.data = binary.substr(headerCharCount);\n            var offsetSign = readBits(header, ptr, constants_1.OFFSET_SIGN_FIELD);\n            ptr += constants_1.OFFSET_SIGN_FIELD;\n            var offset = readBits(header, ptr, constants_1.OFFSET_VAL_FIELD);\n            ptr += constants_1.OFFSET_VAL_FIELD;\n            if (offsetSign) {\n                offset = -offset;\n            }\n            this.offset = offset;\n            var charWidth = readBits(header, ptr, constants_1.CHAR_WIDTH_FIELD);\n            ptr += constants_1.CHAR_WIDTH_FIELD;\n            var pointerWidth = readBits(header, ptr, constants_1.POINTER_WIDTH_FIELD);\n            ptr += constants_1.POINTER_WIDTH_FIELD;\n            var headerFieldChars = Math.ceil(ptr / 6);\n            var charTable = header.substr(headerFieldChars);\n            this.table = charTable.split('').reduce(function (agg, char, i) {\n                agg[char] = i + 1;\n                return agg;\n            }, _defineProperty({}, constants_1.TERMINAL, 0));\n            this.inverseTable = [constants_1.TERMINAL].concat(charTable.split(''));\n            this.wordWidth = charWidth + pointerWidth + 1;\n            this.pointerMask = (0x1 << pointerWidth) - 1;\n            this.charMask = (0x1 << charWidth) - 1;\n            this.charShift = 1 + pointerWidth;\n        }\n\n        _createClass(PackedTrie, [{\n            key: \"test\",\n            value: function test(str) {\n                var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { wildcard: null, prefix: false },\n                    wildcard = _ref.wildcard,\n                    prefix = _ref.prefix;\n\n                return this.search(str, { wildcard: wildcard, prefix: prefix, first: true }) !== null;\n            }\n        }, {\n            key: \"search\",\n            value: function search(str) {\n                var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { wildcard: null, prefix: false, first: false },\n                    wildcard = _ref2.wildcard,\n                    prefix = _ref2.prefix,\n                    first = _ref2.first;\n\n                if (wildcard && wildcard.length !== 1) {\n                    throw new Error(\"Wilcard must be a single character; got \" + wildcard);\n                }\n                var data = this.data,\n                    offset = this.offset,\n                    table = this.table,\n                    inverseTable = this.inverseTable,\n                    wordWidth = this.wordWidth,\n                    lastMask = this.lastMask,\n                    pointerShift = this.pointerShift,\n                    pointerMask = this.pointerMask,\n                    charShift = this.charShift,\n                    charMask = this.charMask;\n\n                var matches = [];\n                var queue = [{ pointer: 0, memo: '', depth: 0 }];\n                var lastDepth = str.length;\n                while (queue.length) {\n                    var node = queue.shift();\n                    var isLast = node.depth >= lastDepth;\n                    var token = isLast ? constants_1.TERMINAL : str[node.depth];\n                    var isWild = token === wildcard || prefix && isLast;\n                    var wordPointer = node.pointer;\n                    while (true) {\n                        if (!isWild && !table.hasOwnProperty(token)) {\n                            break;\n                        }\n                        var bits = wordPointer * wordWidth;\n                        var chunk = readBits(data, bits, wordWidth);\n                        var charIdx = chunk >> charShift & charMask;\n                        if (isWild || charIdx === table[token]) {\n                            var pointer = chunk >> pointerShift & pointerMask;\n                            var newChar = inverseTable[charIdx];\n                            if (isLast && newChar === constants_1.TERMINAL) {\n                                if (first) {\n                                    return node.memo;\n                                }\n                                matches.push(node.memo);\n                                if (!isWild) {\n                                    break;\n                                }\n                            }\n                            if (newChar !== constants_1.TERMINAL) {\n                                queue.push({\n                                    pointer: wordPointer + offset + pointer,\n                                    depth: node.depth + 1,\n                                    memo: node.memo + newChar\n                                });\n                            }\n                        }\n                        var last = chunk & lastMask;\n                        if (last) {\n                            break;\n                        } else {\n                            wordPointer += 1;\n                        }\n                    }\n                }\n                return first ? null : matches;\n            }\n        }]);\n\n        return PackedTrie;\n    }();\n\n    exports.default = PackedTrie;\n});\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/module.js */ \"./node_modules/webpack/buildin/module.js\")(module)))\n\n//# sourceURL=webpack://TinyTrie/./src/PackedTrie.ts?");

/***/ }),

/***/ "./src/base64.ts":
/*!***********************!*\
  !*** ./src/base64.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\n(function (factory) {\n    if (( false ? undefined : _typeof(module)) === \"object\" && _typeof(module.exports) === \"object\") {\n        var v = factory(__webpack_require__(\"./src sync recursive\"), exports);\n        if (v !== undefined) module.exports = v;\n    } else if (true) {\n        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?\n\t\t\t\t(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n    }\n})(function (require, exports) {\n    \"use strict\";\n\n    Object.defineProperty(exports, \"__esModule\", { value: true });\n    exports.BASE64_INT_TO_CHAR = \"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\".split('');\n    exports.BASE64_CHAR_TO_INT = exports.BASE64_INT_TO_CHAR.reduce(function (agg, char, i) {\n        agg[char] = i;\n        return agg;\n    }, {});\n});\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/module.js */ \"./node_modules/webpack/buildin/module.js\")(module)))\n\n//# sourceURL=webpack://TinyTrie/./src/base64.ts?");

/***/ }),

/***/ "./src/constants.ts":
/*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\n(function (factory) {\n    if (( false ? undefined : _typeof(module)) === \"object\" && _typeof(module.exports) === \"object\") {\n        var v = factory(__webpack_require__(\"./src sync recursive\"), exports);\n        if (v !== undefined) module.exports = v;\n    } else if (true) {\n        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?\n\t\t\t\t(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n    }\n})(function (require, exports) {\n    \"use strict\";\n\n    Object.defineProperty(exports, \"__esModule\", { value: true });\n    exports.TERMINAL = '\\0';\n    exports.TERMINUS = Object.create(null);\n    exports.VERSION = 0;\n    exports.HEADER_WIDTH_FIELD = 10;\n    exports.VERSION_FIELD = 10;\n    exports.OFFSET_SIGN_FIELD = 1;\n    exports.OFFSET_VAL_FIELD = 21;\n    exports.CHAR_WIDTH_FIELD = 8;\n    exports.POINTER_WIDTH_FIELD = 8;\n});\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/module.js */ \"./node_modules/webpack/buildin/module.js\")(module)))\n\n//# sourceURL=webpack://TinyTrie/./src/constants.ts?");

/***/ })

/******/ });
});