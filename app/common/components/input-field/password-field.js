'use strict';
angular.module('common.components.inputField').directive('passwordField', function () {
    return {
        restrict: 'EA',
        scope: {
            ngModel: '=',
            placeholder: '@',
            ngDisabled: '=',
            passwordFieldClass: '@',

            ngId: '@'//input id值
        },
        replace: true,
        template: '' +
        '<div class="text-field password-field">' +
        '   <div ng-class="{\'input-group field disabled\': ngDisabled,\'input-group field\': !ngDisabled}">' +
        '       <input id="{{ngId}}" type="{{pwdType}}" ng-model="ngModel" placeholder="{{placeholder}}" maxlength="14" autocorrect="false" autocomplete="new-password" class="form-control {{input-cls}}" ng-blur="onInputBlur()" ng-focus="onInputFocus()"/>' +
        '       <span ng-if="pwdType!=\'text\' && ngModel.length > 0" class="input-group-inner-addon glyphicon glyphicon-eye-open" title="显示密码" ng-click="changePwdType()"></span>' +
        '       <span ng-if="pwdType==\'text\'  && ngModel.length > 0" class="input-group-inner-addon glyphicon glyphicon-eye-close" title="隐藏密码" ng-click="changePwdType()"></span>' +
        '   </div>' +
        '</div>',

        link: function ($scope, $element) {
            $scope.pwdType = "password";
            $scope.changePwdType = function () {
                $scope.pwdType = $scope.pwdType == "password" ? "text" : "password";
            };

            //只能是字母或者数字
            $scope.$watch('ngModel', function (newVal, oldVal) {
                var password = /^[A-Za-z0-9]+$/;
                if (newVal != null && newVal != "" && newVal.trim() != null) {
                    if (password.test(newVal)) {
                        $scope.ngModel = newVal;
                    } else {
                        $scope.ngModel = oldVal;
                    }
                }
            });

            $scope.onInputFocus = function () {
                $('.field', $element).addClass('focus');
                $('.form-control',$element).select();
            };

            $scope.onInputBlur = function () {
                $('.field', $element).removeClass('focus');
            };

        }
    }
});