var path = require('path');
var process = require('process');

// This configuration may be symlinked from a project, thus __dirname may
// point to its physical location.
var projectDir = process.cwd();

// Reuse the webpack configuration for tests, but bundle everything.
var webpack = require(path.join(projectDir, 'webpack.config.js'));
webpack.entry = {};
webpack.externals = {};


module.exports = function(config) {
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
//            'PhantomJS2',
            'Firefox',
//            'Chrome'
        ],
        plugins: [
            'karma-chai',
            'karma-dirty-chai',
            'karma-mocha',
            'karma-sinon-chai',
            'karma-webpack',
//            'karma-phantomjs2-launcher',
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
