'use strict';
angular.module('common.components.inputField')
    .directive("radioField", ['$timeout', function ($timeout) {
        var template = '' +
            '<div class="radio-field {{radioFieldClass}}">' +
            '<div ng-click="onRadioClick()"  >' +
            '   <input type="radio" name="{{group}}" ng-model="ngModel" ng-value="ngValue"/>' +
            '   <div ng-class="{' +
            '       \'field icon radio-normal-unchecked-icon\' : (ngModel!=ngValue && disabled!=\'true\'), ' +
            '       \'field icon radio-normal-checked-icon\': (ngModel==ngValue && disabled!=\'true\'),' +
            '       \'field icon radio-disabled-checked-icon\': (ngModel!=ngValue && disabled==\'true\'),' +
            '       \'field icon radio-disabled-unchecked-icon\': (ngModel==ngValue && disabled==\'true\') ' +
            '       }"></div>' +
            '   <div class="caption">{{caption}}</div>' +
            '</div>';

        return {
            restrict: 'E',
            scope: {
                group: '@',
                ngModel: '=',
                ngValue: '=',
                ngClick: '=',
                caption: '@',
                disabled: '@',
                uncheckable: '@', //是否支持反选
                radioFieldClass: '@'
            },
            replace: false,
            link: function ($scope, $elem, attrs) {
                //Options
                $scope.caption = $scope.caption || '';

                //public method
                $scope.onRadioClick = function () {
                    if($scope.uncheckable == 'true'){
                        if($scope.ngModel == $scope.ngValue){
                            $scope.ngModel = null;
                        }else{
                            $scope.ngModel = $scope.ngValue;
                        }
                    }else{
                        $scope.ngModel = $scope.ngValue;
                    }

                    if($scope.ngClick){
                        $scope.ngClick();
                    }
                };
            },
            template: template
        };
    }]);