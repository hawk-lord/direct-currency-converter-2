// Karma configuration
// Generated on Sun Aug 30 2015 21:09:48 GMT+0300 (EEST)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        //frameworks: ['mocha', 'requirejs'],
        frameworks: ['mocha','chai'],


        // list of files / patterns to load in the browser
        files: [
            // default was false
            {pattern: 'data/common/jquery-2.1.3.min.js', included: true},
            {pattern: 'data/common/dcc-content.js', included: true},
            {pattern: 'data/common/dcc-regexes.js', included: true},
            {pattern: 'data/common/dcc-settings.js', included: true},
            {pattern: 'lib/dcc-common-lib/eventAggregator.js', included: true},
            {pattern: 'lib/ff-storage-service.js', included: true},
            {pattern: 'lib/dcc-common-lib/freegeoip-service.js', included: true},
            {pattern: 'lib/dcc-common-lib/informationHolder.js', included: true},
            {pattern: 'lib/dcc-common-lib/yahoo-quotes.js', included: true},
            {pattern: 'test/karma/dcc-mock-content-adapter.js', included: true},
            {pattern: 'test/karma/dcc-mock-contentscriptparams.js', included: true},
            {pattern: 'test/karma/dcc-mock-informationholder.js', included: true},
            {pattern: 'test/karma/dcc-mock-status.js', included: true},
            {pattern: 'test/karma/test-contentScriptParams.js', included: true},
            {pattern: 'test/karma/test-dcc-content.js', included: true},
            {pattern: 'test/karma/test-dcc-regexes.js', included: true},
            {pattern: 'test/karma/test-dcc-settings.js', included: true},
            {pattern: 'test/karma/test-eventAggregator.js', included: true},
            {pattern: 'test/karma/test-ff-storage-service.js', included: true},
            {pattern: 'test/karma/test-freegeoip-service.js', included: true},
            {pattern: 'test/karma/test-informationHolder.js', included: true},
            {pattern: 'test/karma/test-yahoo-quotes.js', included: true}
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Firefox'],

        plugins : ['karma-firefox-launcher', 'karma-phantomjs-launcher', 'karma-chai', 'karma-mocha'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    })
};
