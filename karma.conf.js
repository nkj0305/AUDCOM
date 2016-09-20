module.exports = function(config) {
  config.set({
    basePath : '.',
    browsers: ['PhantomJS'],
    frameworks: ['jasmine', 'browserify'],
    
    plugins : [
      'karma-browserify',
      'karma-coverage',
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-spec-reporter',
    ],
    
    
    preprocessors: {
      'client/lib/angular/angular.js' : ['browserify'],
      'client/lib/angular/angular-route.js' : ['browserify'],
      'node_modules/angular-mocks/angular-mocks.js': ['browserify'],
      'node_modules/angular-mocks/ngMock.js': ['browserify'],
      'client/js/profile.js': ['coverage'],
      'hello.js': ['coverage'],
      //'tests/**/*.spec.js' : ['browserify'],
    }  ,
 
    files: [
      'client/lib/angular/angular.js',
      'client/lib/angular/angular-route.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-mocks/ngMock.js',
      'client/js/profile.js',
      'hello.js',
      'tests/**/*.spec.js' 
    ],
    reporters: ['spec','coverage', 'progress'],
    coverageReporter: {
        type: 'lcov',
        dir: 'reports',
        file: 'lcov.info'
    },
    port: 9876,
    runnerPort: 9100,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['PhantomJS'],
  });
};  