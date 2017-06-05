'use strict';
angular.module('common.components.inputField')
    .directive("checkboxField", ['$timeout', function ($timeout) {
        var template = '' +
            '<div class="checkbox-field {{checkboxFieldClass}}" ng-click="toggle()">' +
            '   <div ng-class="{' +
            '       \'field icon checkbox-normal-unchecked-icon\' : (ngModel!=true && ngDisabled!=true), ' +
            '       \'field icon checkbox-normal-checked-icon\': (ngModel==true && ngDisabled!=true),' +
            '       \'field cursor-not-allowed icon checkbox-disabled-checked-icon\': (ngModel==true && ngDisabled==true),' +
            '       \'field cursor-not-allowed icon checkbox-disabled-unchecked-icon\': (ngModel!=true && ngDisabled==true) ' +
            '       }"></div>' +
            '   <div ng-if="caption" class="caption">{{caption}}</div>' +
            '</div>';

        return {
            restrict: 'E',
            scope: {
                caption: '@',
                ngDisabled: '=',
                ngModel: '=',
                checkboxFieldClass: '@',

                onChecked: '&'
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
                    if($scope.ngDisabled == true){
                        return;
                    }
                    $scope.ngModel = !$scope.ngModel;

                    if($scope.onChecked){
                        $timeout($scope.onChecked);
                    }
                };
            },
            template: template
        };
    }]);