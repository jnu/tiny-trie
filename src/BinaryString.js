import floor_log2 from './floor_log2';

/**
 * Lookup table for transforming a 6-bit binary integer into a Base-64 ASCII
 * character.
 * @type {String[]}
 */
const BASE64_TABLE = `\
ABCDEFGHIJKLMNOPQRSTUVWXYZ\
abcdefghijklmnopqrstuvwxyz\
0123456789\
+/\
`.split('');


/**
 * Interface for writing binary data into a Base64-encoded string
 */
class BinaryString {

    constructor() {

        /**
         * Data buffer
         * @type {Number?}
         */
        this.buffer = 0;

        /**
         * Word pointer for buffer. With every entry into the buffer, the
         * pointer gets incremented by the entry's width. Every six characters
         * may be encoded, so when the pointer exceeds 6, the buffer can be
         * emptied until the pointer is back under 6.
         * @type {Number}
         */
        this.pointer = 0;

        /**
         * Encoded data as a string of base64 characters
         * @type {String}
         */
        this.data = '';
    }

    /**
     * Write a value to the binary string. This value should be thought of as
     * an integer representing the binary data to write.
     * @param  {Integer} val - data to write
     * @param  {Integer} [width] - optionally specify a width for this data.
     *                             if none is given, width will be inferred
     *                             automatically. An error will be thrown if
     *                             the width is too small to contain the data.
     * @return {[type]}       [description]
     */
    write(val, width = null) {
        let buf = this.buffer;
        let len = width || floor_log2(val) + 1;

        if (width && val >= (0x1 << width)) {
            throw new Error(`Can't write ${val} in only ${width} bits`);
        }

        this.buffer = (buf << len) | val;
        this.pointer += len;

        this._digest();
    }

    /**
     * Encode the remaining items in the buffer. Use this when the input stream
     * is finished to ensure that all data has been encoded.
     */
    flush() {
        let buffer = this.buffer;
        let pointer = this.pointer;
        // NB if pointer is at 0, there's nothing to flush.
        while (pointer && pointer < 6) {
            buffer <<= 1;
            pointer += 1;
        }
        this.pointer = pointer;
        this.buffer = buffer;
        this._digest();
    }

    /**
     * Get the binary data as base64. This output does not include padding
     * characters. This procedure flushes the buffer.
     * @return {String}
     */
    getData() {
        this.flush();
        return this.data;
    }

    // Process as many items from the buffer as possible
    _digest() {
        let buffer = this.buffer;
        let pointer = this.pointer;
        let newData = '';
        while (pointer >= 6) {
            let remainder = (pointer - 6);
            let code = buffer >> remainder;
            buffer = buffer ^ (code << remainder);
            pointer = remainder;
            newData += BASE64_TABLE[code];
        }
        this.pointer = pointer;
        this.buffer = buffer;
        this.data += newData;
    }

}

export default BinaryString;
