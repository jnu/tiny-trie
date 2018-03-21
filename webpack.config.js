/* eslint-env node */
var path = require('path');

var DEBUG = process.env.NODE_ENV !== 'production';

var bundleExt = (DEBUG ? '' : '.min') + '.js';


module.exports = {
    entry: {
        'tiny-trie': './src/index.ts',
        'packed-trie': './src/PackedTrie.ts'
    },
    mode: DEBUG ? 'development' : 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: {cacheDirectory: true}
                }]
            },
            {
                test: /\.ts$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: {cacheDirectory: true}
                }, {
                    loader: 'ts-loader'
                }]
            },
        ],
    },
    devtool: DEBUG ? 'source-map' : false,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]' + bundleExt,
        libraryTarget: 'umd',
        library: 'TinyTrie'
    },
    resolve: {
        extensions: ['.js', '.ts'],
        modules: [path.join(__dirname, 'src'), 'node_modules']
    }
};
