/* eslint-env node */
var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var path = require('path');

var DEBUG = process.env.NODE_ENV !== 'production';

var bundleName = 'tiny-trie' + (DEBUG ? '' : '.min') + '.js';

var plugins = [];
if (!DEBUG) {
    plugins.push(new UglifyJsPlugin());
}

module.exports = {
    entry: './src/index.js',
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel?presets[]=es2015'
            }
        ]
    },
    plugins: plugins,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: bundleName,
        libraryTarget: 'umd',
        library: 'TinyTrie'
    }
};
