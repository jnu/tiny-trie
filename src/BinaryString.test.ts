/* eslint-env mocha */
import {BinaryString} from './BinaryString';
import {assert} from 'chai';

describe('BinaryString', () => {

    describe('constructor', () => {
        it('creates an empty binary string', () => {
            let bs = new BinaryString();

            assert.strictEqual(bs['buffer'], 0);
            assert.strictEqual(bs['pointer'], 0);
            assert.strictEqual(bs['data'], '');
            assert.strictEqual(bs.getData(), '');
        });
    });

    describe('write', () => {
        it('should add an item to the buffer', () => {
            let bs = new BinaryString();

            bs.write(1);
            assert.strictEqual(bs['buffer'], 1);
            assert.strictEqual(bs['pointer'], 1);
            assert.strictEqual(bs['data'], '');

            bs.write(0);
            assert.strictEqual(bs['buffer'], 2);
            assert.strictEqual(bs['pointer'], 2);
            assert.strictEqual(bs['data'], '');

            bs.write(3);
            assert.strictEqual(bs['buffer'], 11);
            assert.strictEqual(bs['pointer'], 4);
            assert.strictEqual(bs['data'], '');
        });

        it('should write encoded data whenever buffer is sufficently full', () => {
            let bs = new BinaryString();

            bs.write(1);
            bs.write(1);
            bs.write(1);
            bs.write(1);
            bs.write(1);
            assert.strictEqual(bs['buffer'], 31);
            assert.strictEqual(bs['pointer'], 5);
            assert.strictEqual(bs['data'], '');
            bs.write(1);
            assert.strictEqual(bs['buffer'], 0);
            assert.strictEqual(bs['pointer'], 0);
            assert.strictEqual(bs['data'], '/');

            bs.write(64);
            assert.strictEqual(bs['buffer'], 0);
            assert.strictEqual(bs['pointer'], 1);
            assert.strictEqual(bs['data'], '/g');
        });

        it('should write data into a specified width', () => {
            let bs = new BinaryString();

            bs.write(0, 2);
            assert.strictEqual(bs['buffer'], 0);
            assert.strictEqual(bs['pointer'], 2);
            assert.strictEqual(bs['data'], '');

            bs.write(1, 4);
            assert.strictEqual(bs['buffer'], 0);
            assert.strictEqual(bs['pointer'], 0);
            assert.strictEqual(bs['data'], 'B');
        });

        it('should throw an error if trying to write into too small a width', () => {
            let bs = new BinaryString();

            assert.throws(() => bs.write(2, 1));
        });
    });

    describe('flush', () => {
        it('should empty the buffer, padding remaining contents with 0', () => {
            let bs = new BinaryString();

            bs.write(2);

            bs.flush();
            assert.strictEqual(bs['buffer'], 0);
            assert.strictEqual(bs['pointer'], 0);
            assert.strictEqual(bs['data'], 'g');
            assert.strictEqual(bs.getData(), 'g');
        });
    });

    describe('getData', () => {
        it('should get the data as a base-64 encoded string', () => {
            let bs = new BinaryString();

            bs.write(1, 6);
            assert.strictEqual(bs['buffer'], 0);
            assert.strictEqual(bs['pointer'], 0);
            assert.strictEqual(bs['data'], 'B');
            assert.strictEqual(bs.getData(), 'B');
        });

        it('should flush the buffer when getting data', () => {
            let bs = new BinaryString();

            bs.write(1, 2);
            assert.strictEqual(bs['buffer'], 1);
            assert.strictEqual(bs['pointer'], 2);
            assert.strictEqual(bs['data'], '');
            assert.strictEqual(bs.getData(), 'Q');
            assert.strictEqual(bs['data'], 'Q');
        });
    });

});
