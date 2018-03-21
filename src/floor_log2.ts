/**
 * @file Provides a fast floor_log2 function
 */

/**
 * Fast floor(log2(x)) operation
 * @param  {Number} x
 * @return {Number}
 */
export function floor_log2(x: number) {
    let n = 0;
    while (x >>= 1) {
        n++;
    }
    return n;
}
