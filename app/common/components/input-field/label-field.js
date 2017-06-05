'use strict';
angular.module('common.components.inputField').directive('labelField', [function () {
    return {
        scope: {
            caption: '@',
            requiredMark: '@',
            ngId: '@',//input id值

            labelFieldClass: '@'
        },
        restrict: 'E',
        transclude: true,

        link: function ($scope, $element, $attrs, $ngModelCtrl) {

            $scope.onLoad = function () {

            };

            $scope.onLoad();
        },
        template: '' +
        '<div class="label-field {{labelFieldClass}}">' +
        '   <div class="caption">' +
        '       <label class="required-mark">{{requiredMark=="true"?"*":""}}</label>' +
        '       <label title="{{caption}}">{{caption}}</label>' +
        '   </div>' +
        '   <div class="field" ng-transclude></div>' +
        '</div>'
    }
}])
;