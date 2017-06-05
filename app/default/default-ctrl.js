'use strict';
angular.module('elkChromeApp.defaultModule').controller('defaultCtrl', ['$scope', '$rootScope', '$state', '$timeout', '$window', 'constants', 'commonDialogProvider',
    function ($scope, $rootScope, $state, $timeout, $window, constants, commonDialogProvider) {
        /**
         * 页面加载逻辑
         */
        $scope.onLoad = function () {
            $rootScope.title = 'ELK Chrome APP - Welcome';
        };

        $scope.onLoad();
    }]);
