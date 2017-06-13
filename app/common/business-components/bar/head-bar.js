'use strict';
angular.module('common.businessComponents.bar').directive("headBar", ['$rootScope', '$timeout', '$state','constants','$window', 'commonDialogProvider', function ($rootScope, $timeout, $state,constants,$window, commonDialogProvider) {
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
                $scope.model = {};
                $scope.model.esServerUrl = constants.CONFIG.ES_SERVER_URL;

                $scope.model.envOptions = [];
                _.each(constants.CONFIG.environments, function(env){
                    $scope.model.envOptions.push({text:env.name, value:env.name});
                });

            };


            $scope.logQueryAnalyzer = function(){
                $state.go('main.logQueryAnalyzer', {});
            };

            $scope.onActionBtnClicked = function(){
                if(!$scope.model.env){
                    commonDialogProvider.alert('请选择ENV');
                    return;
                }
                $scope.onEsServerConnection($scope.model.env.value, $scope.model.esServerUrl);
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
        '               <li style="width: 200px; padding-top:5px;">' +
        '                   <label-field caption="ENV" >' +
        '                       <dropdown-field ng-model="model.env" search-title="请选择" option-list="model.envOptions" option-text="text" option-value="value" >' +
        '                       </dropdown-field>' +
        '                   </label-field>'+
        '               </li>' +
        '               <li style="width: 500px; padding-top:5px;">' +
        '                   <label-field caption="ES Server" >' +
        '                       <text-field ng-model="model.esServerUrl" type="text" text-field-class="es-server-field" action-caption="Connect" action-btn-support="true" action-btn-action="onActionBtnClicked"/>' +
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