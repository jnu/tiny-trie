/**
 * @file Lookup tables for Base64 conversions
 */

/**
 * Lookup table for transforming a 6-bit binary integer into a Base-64 ASCII
 * character.
 * @constant {String[]}
 */
export const BASE64_INT_TO_CHAR = `\
ABCDEFGHIJKLMNOPQRSTUVWXYZ\
abcdefghijklmnopqrstuvwxyz\
0123456789\
+/\
`.split('');

/**
 * Inverse lookup table for transformating a Base-64 ASCII character into the
 * corresponding integer value.
 * @constant {Object}
 */
export const BASE64_CHAR_TO_INT = BASE64_INT_TO_CHAR.reduce((agg, char, i) => {
    agg[char] = i;
    return agg;
}, {});
