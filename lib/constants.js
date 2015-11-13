/**
 * @file Parameters used for encoding
 */

/**
 * String terminal character
 * @constant {String}
 */
export const TERMINAL = '\0';

/**
 * Terminal edge
 * @constant {Object}
 */
export const TERMINUS = Object.create(null);

/**
 * Encoding version. Bump when breaking encoding changes are introduced.
 * @constant {Number}
 */
export const VERSION = 0;

/**
 * Width of header field storing entire header width (including char table).
 * Value is given in Base64 characters (i.e., every six bits)
 * @constant {Number}
 */
export const HEADER_WIDTH_FIELD = 10;

/**
 * Width of version field
 * @type {Number}
 */
export const VERSION_FIELD = 10;

/**
 * Width of header field representing sign of offset
 * @constant {Number}
 */
export const OFFSET_SIGN_FIELD = 1;

/**
 * Width of header field representing unsigned value of offset
 * @constant {Number}
 */
export const OFFSET_VAL_FIELD = 21;

/**
 * Width of header field representing the width of the char index in a word
 * @constant {Number}
 */
export const CHAR_WIDTH_FIELD = 8;

/**
 * Width of header field representing the width of the offset pointer in a word
 * @constant {Number}
 */
export const POINTER_WIDTH_FIELD = 8;
