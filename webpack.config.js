var child = require('child_process');
var minimist = require('minimist');
var path = require('path');
var process = require('process');
var string = require('string-replace-webpack-plugin');
var webpack = require('webpack');

// This configuration may be symlinked from a project, thus __dirname may
// point to its physical location.
var projectDir = process.cwd();

// Global location of node modules (OS-specific).
var globalModules = String(child.execSync('npm root -g')).trim();

// What edition of the standard are we building for?
var esEdition = minimist(process.argv.slice(2)).es || 5;

// Some often-module-specific configuration can be done through package.json.
try {
    config = require(path.join(projectDir, 'package.json'));
} catch (e) {
    config = {};
}

// What file are we generating (relative path)?
var target = config['main:es' + esEdition];
var output = {
    filename: path.basename(target),
    path: path.join(projectDir, path.dirname(target)),
    publicPath: path.dirname(target),
};
if (config.webpackLibrary) {
    output.library = config.webpackLibrary;
    output.libraryTarget = 'umd';
}

// Modules not to be bundled (to be loaded by the user).
var externals = config.webpackExternals || {};

// What modules should Babel process?
var babelDirs = config.webpackBabelDirs || [];
babelDirs.push(projectDir);

// What should Babel transpile to? (Just ES5 is supported at the moment :-)
var babelPresets;
switch (esEdition) {
    // Workaround: https://github.com/webpack/webpack/issues/1883.
    case 5: babelPresets = ['es2015' /*-webpack2*/, 'stage-0', 'react']; break;
    case 6: babelPresets = ['stage-0', 'react']; break;
    case 7: babelPresets = ['react']; break;
}

// A loader collapsing continuation lines.
var contLines = string.replace({replacements: [
    {pattern: /,\n/g, replacement: () => ', '}
]});


module.exports = {
    entry: './main.jsx',
    output: output,
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
                query: {presets: babelPresets}
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass']
            },
            // Workaround: https://github.com/jtangelder/sass-loader/pull/196,
            //             and https://github.com/sass/sass/issues/216.
            {
                test: /\.sass$/,
                loaders: ['style', 'css', 'sass?indentedSyntax', contLines]
            }
        ]
    },
    plugins: [
        new string()
    ]
};
