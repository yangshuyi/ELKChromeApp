'use strict';
angular.module('elkChromeApp.logQueryAnalyzerModule', ['common.utils', 'common.components.inputField', 'common.components.dialog', 'common.components.grid']);

angular.module('elkChromeApp.logQueryAnalyzerModule').config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('main.logQueryAnalyzer', {
        url: '/logQueryAnalyzer',
        controller: 'logQueryAnalyzerCtrl',
        templateUrl: 'app/log-query-analyzer/log-query-analyzer.html'
    });
}]);
