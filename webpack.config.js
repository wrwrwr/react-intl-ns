var child = require('child_process');
var path = require('path');
var process = require('process');
var string = require('string-replace-webpack-plugin');
var webpack = require('webpack');

// This configuration may be symlinked from a project, thus __dirname may
// point to its physical location.
var projectDir = process.cwd();

// Global location of node modules (OS-specific).
var globalModules = String(child.execSync('npm root -g')).trim();

// Some often-module-specific configuration can be done through package.json.
try {
    config = require(path.join(projectDir, 'package.json'));
} catch (e) {
    config = {};
}

// What editions of the standard are we building for?
var esEditions = config.webpackEsEditions || [5];

// What file are we generating (relative path)?
var outputs = esEditions.map(edition => {
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
var externals = config.webpackExternals || {};

// What modules should Babel process?
var babelDirs = config.webpackBabelDirs || [];
babelDirs.push(projectDir);

// What should Babel transpile to? (Just ES5 is supported at the moment :-)
var babelPresets = esEditions.map(edition => {
    switch (edition) {
        // WA: https://github.com/webpack/webpack/issues/1883.
        case 5: return ['es2015' /*-webpack2*/, 'stage-0', 'react'];
        case 6: return ['stage-0', 'react'];
        case 7: return ['react'];
    }
});

// A loader collapsing continuation lines.
var contLines = string.replace({replacements: [
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
