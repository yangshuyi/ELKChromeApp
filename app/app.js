'use strict';
angular.module('elkChromeApp', ['ui.router', 'restangular'
    ,'common.utils', 'common.components.dialog', 'common.components.notify', 'common.components.loadingMask'
    ,'common.businessComponents.bar', 'common.businessComponents.interceptor','common.businessComponents.model'
    ,'elkChromeApp.defaultModule', 'elkChromeApp.logQueryAnalyzerModule']);

angular.module('elkChromeApp').config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'RestangularProvider', 'commonDialogProviderProvider', function ($stateProvider, $urlRouterProvider, $httpProvider, RestangularProvider, commonDialogProviderProvider) {
    //HTTP拦截器
    $httpProvider.interceptors.push('httpCacheInterceptor');

    $stateProvider
        .state('main', {
            url: '/main',
            templateUrl: 'app/main.html',
            controller: ['$scope', '$rootScope', 'constants', 'urlUtils', 'esDaoUtils', '$state', 'commonDialogProvider', 'notifyProvider', function ($scope, $rootScope, constants, urlUtils, esDaoUtils, $state, commonDialogProvider, notifyProvider) {
                $scope.onLoad = function () {
                    console.log('main.onload')
                    $rootScope.currentState = $state;
                    $rootScope.isEsConnected = false;
                    //日期格式化
                    moment.locale('zh-cn');

                    $scope.$on('$stateChangeError', function (evt, to, toParams, from, fromParams, error) {
                        console.log("WHOOAAAATTT!!! " + error);
                    });

                    urlUtils.setAppErrorDialogProvider(commonDialogProvider);
                };

                $scope.onESServerConnection = function(env, esServerUrl){
                    $rootScope.env = env;
                    $rootScope.esServerUrl = esServerUrl;
                    urlUtils.setRootPath($rootScope.esServerUrl);
                    esDaoUtils.connectToEs().then(function(clusterName){
                        if(clusterName){
                            notifyProvider.notify("连接["+clusterName+"]成功");
                            $rootScope.isEsConnected = true;
                            $state.go('main.logQueryAnalyzer', {});
                        }else{
                            $rootScope.isEsConnected = false;
                            $state.go('main.defaultModule', {});
                        }
                    });
                };

                $rootScope.globalKeyDownEventHandler = function($event){
                    if($event.type == 'keydown'){
                        if($event.keyCode == 13){
                            $scope.$broadcast(constants.NG_EVENT.GLOBAL.ENTER_KEY_DOWN, $event);
                        }
                    }
                };

                $scope.onLoad();
            }]
        });

    $urlRouterProvider.otherwise('/main/default');
}]);
