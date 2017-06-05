'use strict';
angular.module('elkChromeApp.defaultModule', ['common.utils']);

angular.module('elkChromeApp.defaultModule').config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('main.default', {
        url: '/default',
        controller: 'defaultCtrl',
        templateUrl: 'app/default/default.html'
    });
}]);
