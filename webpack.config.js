/* eslint-env node */
var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var path = require('path');

var DEBUG = process.env.NODE_ENV !== 'production';

var bundleExt = (DEBUG ? '' : '.min') + '.js';

var plugins = [];
if (!DEBUG) {
    plugins.push(new UglifyJsPlugin());
}

module.exports = {
    entry: {
        'tiny-trie': './src/index.js',
        'packed-trie': './src/PackedTrie.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel?cacheDirectory'
            }
        ]
    },
    plugins: plugins,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]' + bundleExt,
        libraryTarget: 'umd',
        library: 'TinyTrie'
    }
};
