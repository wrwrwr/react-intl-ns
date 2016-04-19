'use strict';

const path = require('path');
const process = require('process');

// This configuration may be symlinked from a project, thus __dirname may
// point to its physical location.
let projectDir = process.cwd();

// Reuse the Webpack configuration for tests, but bundle everything.
let webpack = require(path.join(projectDir, 'webpack.config.js'));
if (typeof webpack === 'function') {
    webpack = webpack('t');
}
if (!Array.isArray(webpack)) {
    webpack = [webpack];
}
for (let config of webpack) {
    config.target = 'web';
    config.entry = {};
    config.externals = {'fs': '', 'yargs': ''};
}


module.exports = config => {
    config.set({
        files: [
            'tests/*.jsx'
        ],
        frameworks: [
            'chai',
            'dirty-chai',
            'mocha',
            'sinon-chai'
        ],
        preprocessors: {
            'tests/*.jsx': ['webpack']
        },
        browsers: [
//            'PhantomJS',
            'Firefox',
//            'Chrome'
        ],
        plugins: [
            'karma-chai',
            'karma-dirty-chai',
            'karma-mocha',
            'karma-sinon-chai',
            'karma-webpack',
//            'karma-phantomjs-launcher',
            'karma-firefox-launcher',
//            'karma-chrome-launcher'
        ],
        reporters: [
            'progress'
        ],
        reportSlowerThan: 100,
        singleRun: true,
        webpack: webpack,
        webpackServer: {
            noInfo: true
        }
    });
};
