'use strict';

require('angular/angular');
require('angular-route/angular-route');

var services = angular.module('services', []);
var controllers = angular.module('controllers', ['services']);
var directives = angular.module('directives', []);

(function() {
  var voucherApp = angular.module('voucherApp', [
    'ngRoute', 'services', 'controllers', 'directives'
  ]);

  //require('./services')(services);
  require('./controllers')(controllers);
  //require('./directives')(directives);

  voucherApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: '/partials/splash.html', controller: 'SplashController'});

    $routeProvider.when('/ltrSignUp', {templateUrl: '/partials/ltr-signup.html', controller: 'LtrController'});

    $routeProvider.when('/ltlSignUp', {templateUrl: '/partials/ltl-signup.html', controller: 'LtlController'});

    $routeProvider.when('/ltrHome', {templateUrl: '/partials/ltr-home.html', controller: 'LtlController'});

    $routeProvider.when('/ltlHome', {templateUrl: '/partials/ltl-home.html', controller: 'LtrController'});

    $routeProvider.otherwise({redirectTo: '/'});
  }]);

})();

