'use strict';
angular.module('common.components.inputField').directive('buttonTextField', ['$timeout', function ($timeout) {
        return {
            restrict: 'EA',
            replace: true,
            require: 'ngModel',
            scope: {
                ngClass: '@',
                buttonLabel: '@',
                ngModel: '=',
                onClick: '&',
                maxLength: '@',
                keyDown: '=',
                initStyle: "@",
                onblurEvent: '=',
                validateFun: '=',
                buttonClass: "@"
            },
            link: function ($scope, element, attrs, ngModel) {
                var disabled = attrs.ngDisabled || "false";
                var inputDisabled = attrs.inputDisabled || "false";
                if (disabled == "true") {
                    $(element).find("input").attr("disabled", "disabled");
                } else {
                    if (inputDisabled == "true") {
                        $(element).find("input").attr("disabled", "disabled");
                    }
                }

                var oldValue = $scope.ngModel;

                ngModel.$parsers.push(function (newValue) {
                    var validate = function (newV) {
                        if (!$scope.validateFun) return true;
                        if (!newV) {
                            $scope.ngModel = null;
                            return true;
                        }
                        return $scope.validateFun(newV);
                    };

                    if (!validate(newValue)) {
                        setViewValue(oldValue);
                        return oldValue;
                    }
                    else {
                        oldValue = newValue;
                        $timeout(function () {
                            $($elem.closest('.input-group')).trigger('change');
                        }, 0); // trigger change event, therefore, trigger the validation process

                        setViewValue(newValue);
                        return newValue;
                    }
                });

                ngModel.$formatters.push(function (v) {
                    $timeout(function () {
                        $($elem.closest('.input-group')).trigger('change');
                    }, 0); // trigger change event, therefore, trigger the validation process
                    return v;
                });

                var setViewValue = function (value) {
                    ngModel.$setViewValue(value);
                    ngModel.$render();
                }
            },
            template: '<div class="input-group text-height" style="border:none !important;">' +
            '<input type="text" title="{{ngModel}}" class="form-control text-height" ng-model="ngModel" ng-keydown="keyDown(ngModel)"  style="{{initStyle}}" maxlength="{{maxLength}}" ng-blur="onblurEvent" >' +
            '<span class="input-group-btn">' +
            '<button class="{{buttonClass ? buttonClass : \'btn btn-default btn-text text-height\'}}" type="button" ng-click="onClick()">' +
            '<span ng-if="!!buttonLabel" >{{ buttonLabel }}</span>' +
            '<span ng-if="!buttonLabel" class="glyphicon glyphicon-search" aria-hidden="true"></span>' +
            '</button>' +
            '</span>' +
            '</div>'
        };
    }]);
