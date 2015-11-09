/**
 * Fast floor(log2(x)) operation
 * @param  {Number} x
 * @return {Number}
 */
export default function floor_log2(x) {
    let n = 0;
    while (x >>= 1) {
        n++;
    }
    return n;
}
