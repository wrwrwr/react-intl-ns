'use strict';

const child = require('child_process');
const path = require('path');
const process = require('process');
const string = require('string-replace-webpack-plugin');
const webpack = require('webpack');

// This configuration may be symlinked from a project, thus __dirname may
// point to its physical location.
let projectDir = process.cwd();

// Global location of node modules (OS-specific).
let globalModules = String(child.execSync('npm root -g')).trim();

// Some often-module-specific configuration can be done through package.json.
let config;
try {
    config = require(path.join(projectDir, 'package.json'));
} catch (e) {
    config = {};
}

// What editions of the standard are we building for?
let esEditions = config.webpackEsEditions || [5];

// What file are we generating (relative path)?
let outputs = esEditions.map(edition => {
    var target = config['main:es' + edition];
    var output = {
        filename: path.basename(target),
        path: path.join(projectDir, path.dirname(target)),
        publicPath: path.dirname(target)
    };
    if (config.webpackLibrary) {
        output.library = config.webpackLibrary;
        output.libraryTarget = 'umd';
    }
    return output;
});

// Modules not to be bundled (to be loaded by the user).
let externals = config.webpackExternals || {};

// What modules should Babel process?
let babelDirs = config.webpackBabelDirs || [];
babelDirs.push(projectDir);

// What should Babel transpile to? (Just ES5 is supported at the moment :-)
let babelPresets = esEditions.map(edition => {
    switch (edition) {
        // WA: https://github.com/webpack/webpack/issues/1883.
        case 5: return ['es2015' /*-webpack2*/, 'stage-0', 'react'];
        case 6: return ['stage-0', 'react'];
        case 7: return ['react'];
    }
});

// A loader collapsing continuation lines.
let contLines = string.replace({replacements: [
    {pattern: /,\n/g, replacement: () => ', '}
]});


module.exports = esEditions.map((edition, index) => ({
    entry: './main.jsx',
    output: outputs[index],
    externals: externals,
    resolve: {
        extensions: ['', '.js', '.jsx'],
        modules: ['node_modules', globalModules]
    },
    resolveLoader: {
        modules: ['node_modules', globalModules]
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                include: RegExp(babelDirs.join('|')),
                loader: 'babel',
                query: {presets: babelPresets[index]}
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass']
            },
            // WA: https://github.com/jtangelder/sass-loader/pull/196,
            //     and https://github.com/sass/sass/issues/216.
            {
                test: /\.sass$/,
                loaders: ['style', 'css', 'sass?indentedSyntax', contLines]
            }
        ]
    },
    plugins: [
        new string()
    ]
}));
