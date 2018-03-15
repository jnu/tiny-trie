/* eslint-env mocha */
import floor_log2 from './floor_log2';
import {assert} from 'chai';

describe('floor_log2', () => {
    it('should compute the floored log base 2 of a number', () => {
        assert.strictEqual(floor_log2(0), 0);
        assert.strictEqual(floor_log2(1), 0);
        assert.strictEqual(floor_log2(2), 1);
        assert.strictEqual(floor_log2(3), 1);
        assert.strictEqual(floor_log2(4), 2);
        assert.strictEqual(floor_log2(5), 2);
        assert.strictEqual(floor_log2(6), 2);
        assert.strictEqual(floor_log2(7), 2);
        assert.strictEqual(floor_log2(8), 3);
        assert.strictEqual(floor_log2(15), 3);
        assert.strictEqual(floor_log2(16), 4);
    });
});
