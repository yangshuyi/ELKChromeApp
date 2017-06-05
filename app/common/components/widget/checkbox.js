'use strict';
angular.module('common.components.widget')
    .directive("checkbox", ['$timeout', function ($timeout) {
        var template = '' +
            '<div class="check-box {{checkboxCls}}" ng-click="toggle()">' +
            '   <span style="{{paddingLeft}}" ng-class="{' +
            '       field : (ngModel!=true && disabled!=\'true\'), ' +
            '       \'field checked\': (ngModel==true && disabled!=\'true\'),' +
            '       \'field disabled\': (ngModel!=true && disabled==\'true\'),' +
            '       \'field disabledchecked\': (ngModel==true && disabled==\'true\') ' +
            '       }"></span>{{caption}}' +
            '</div>';

        return {
            restrict: 'EA',
            scope: {
                caption: '@',
                disabled: '@',
                ngModel: '=',
                checkboxCls: '@'
            },
            replace: false,
            link: function ($scope, $elem, attrs) {
                if($scope.ngModel == 'true'){
                    $scope.ngModel=true;
                }
                //Options
                $scope.caption = $scope.caption || '';
                if($scope.caption){
                    $scope.paddingLeft = 'padding-left:41px;';
                }

                //public method
                $scope.toggle = function () {
                    if($scope.disabled == 'true'){
                        return;
                    }
                    $scope.ngModel = !$scope.ngModel;
                };
            },
            template: template
        };
    }]);