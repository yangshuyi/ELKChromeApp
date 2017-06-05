'use strict';
angular.module('common.components.inputField').directive('remarkField', [function () {
    return {
        require: 'ngModel',
        replace: true,
        scope: {
            caption: '@',
            requiredMark: '@',
            ngId: '@',//input id值
            ngModel: '=',


            ngDisabled: '=',
            remarkFieldClass: '@',
            maxLength: '@',
        },
        restrict: 'E',

        link: function ($scope, $element, $attrs, $ngModelCtrl) {

            $scope.onLoad = function () {
                $scope.$watch('ngModel', function() {
                    var value = $scope.ngModel;

                    $scope.length =value ? value.replace(/\n/g, '').length : 0;
                    var maxLength = Number($scope.maxLength);
                    if ($scope.length > maxLength) {
                        value = value.substring(0, value.length - ($scope.length - maxLength));
                    }
                    $scope.ngModel = value;
                });
            };

            $scope.onLoad();
        },
        template: '' +
        '<div class="remark-field {{remarkFieldClass}}">' +
        '   <div class="header">' +
        '       <div class="caption">' +
        '           <label ng-if="requiredMark==\'true\'" class="required-mark">*</label>' +
        '           <label title="{{caption}}">{{caption}}</label>' +
        '       </div>' +
        '       <div class="word-counter">({{length}}/{{maxLength}})</div>' +
        '   </div>' +
        '   <textarea ng-model="ngModel" ng-trim="false"  ng-disabled="{{ngDisabled}}" maxlength="{{ctrl.maxLength}}" class="content"></textarea>' +
        '</div>'
    }
}])
;