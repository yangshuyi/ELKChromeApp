'use strict';
angular.module('common.businessComponents.bar').directive("headBar", ['$rootScope', '$timeout', '$state','constants','$window', function ($rootScope, $timeout, $state,constants,$window) {
    return {
        restrict: 'E',
        scope: {
            currentState: '=',
            headBarClass : '@',
            onEsServerConnection : '=',
            isEsConnected: '@'
        },
        link: function ($scope, element, attrs) {
            $scope.onLoad = function(){
                $scope.esServerUrl = constants.CONFIG.ES_SERVER_URL;
            };


            $scope.logQueryAnalyzer = function(){
                $state.go('main.logQueryAnalyzer', {});
            };

            $scope.onActionBtnClicked = function(){
                $scope.onEsServerConnection($scope.esServerUrl);
            };

            $scope.onLoad();
        },
        template: '' +
        '<nav class="navbar navbar-default {{headBarClass}}" style="">' +
        '   <div class="container-fluid">' +
        '       <div class="navbar-header">'+
        '           <a class="navbar-brand">LOG QUERY ANALYZER</a>'    +
        '       </div>'    +
        '       <div class="collapse navbar-collapse">' +
        '           <ul class="nav navbar-nav navbar-left">' +
        '               <li></li>' +
        '           </ul>' +
        '           <ul class="nav navbar-nav navbar-right">' +
        '               <li role="separator" class="divider"></li>' +
        '               <li style="width: 500px; padding-top:5px;">' +
        '                   <label-field caption="ES Server" >' +
        '                       <text-field ng-model="esServerUrl" type="text" text-field-class="es-server-field" action-caption="Connect" action-btn-support="true" action-btn-action="onActionBtnClicked"/>' +
        '                   </label-field>'+
        '               </li>' +
        '               <li style="width: 40px; padding-top:5px;">' +
        '                   <div ng-class="{\'connection-status-img connected\': isEsConnected==\'true\',\'connection-status-img unconnected\': isEsConnected!=\'true\'}">' +
        '               </li>' +
        '           </li>' +
        '       </div>' +
        '   </div>' +
        '</nav>'
    }
}]);