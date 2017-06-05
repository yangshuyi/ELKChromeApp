'use strict';
angular.module('common.components.inputField').directive('numberField', ['$timeout', '$templateCache', function ($timeout, $templateCache) {
    var INPUT_TYPE_ARRAY = [
        {key: 'partQty', len: 3, min: 1, max: 999, pattern: /^\+?[1-9][0-9]*$/, description: '配件数量，整数格式'},
        {
            key: 'number',
            len: 60,
            min: null,
            max: null,
            pattern: /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,
            description: "数值类型"
        },
    ];

    var getInputTypeByKey = function (type) {
        var type = _.find(INPUT_TYPE_ARRAY, {key: type});
        if (type == null) {
            return _.find(INPUT_TYPE_ARRAY, {key: 'number'});
        }
        return type;
    };

    return {
        require: 'ngModel',
        scope: {
            name: '@',
            ngModel: '=',
            type: '@',
            ngDisabled: '=',
            numberFieldClass: '@',

            invalidFlag: '@',
            placeholder: '@',
            maxlength: '@',
            onDataChange: '=',

            inputIconSupport: '@',
            inputIconCls: '@',

            ngId: '@'//input id值
        },
        replace: true,
        link: function ($scope, $element, $attrs, $ngModelCtrl) {
            var lastValidValue; //最后一次的合法值

            $scope.type = $scope.type || 'number';
            $scope.name = $scope.name || '';
            $scope.inputType = getInputTypeByKey($scope.type);
            $scope.maxlength = $scope.maxlength != null ? $scope.maxlength : $scope.inputType.len;

            $scope.onLoad = function () {
                lastValidValue = $scope.ngModel;
            };

            /**
             * 输入时，直接检查是否正确。
             */
            $scope.keyPressValidator = function () {
                $scope.isInputInvalid = false;
                var currentValue = $scope.ngModel;

                //regexPatternValidator
                if (currentValue != null && currentValue != '' && $scope.inputType.pattern) {
                    if (!$scope.inputType.pattern.test(currentValue)) {
                        $scope.isInputInvalid = true;
                    }
                }

                if ($scope.isInputInvalid) {
                    $scope.ngModel = lastValidValue;
                }else{
                    lastValidValue =$scope.ngModel;
                }
            };

            /**
             * 焦点移开时，检查值是否正确
             */
            $scope.valueChangeValidator = function () {
                var max = $scope.inputType.max;
                if (max != null) {
                    if (Number($scope.ngModel) > max) {
                        $scope.setModelValue(max);
                    }
                }

                var min = $scope.inputType.min;
                if (min != null) {
                    if (Number($scope.ngModel) < min) {
                        $scope.setModelValue(min);
                    }
                }
            };

            $scope.setModelValue = function (val) {
                $scope.ngModel = val;
                lastValidValue = val;
            };


            $scope.onInputFocus = function () {
                $('.field', $element).addClass('focus');
                $('.form-control',$element).select();
            };

            $scope.onInputBlur = function () {
                $('.field', $element).removeClass('focus');
                $scope.valueChangeValidator();
                $timeout(function(){
                    if($scope.onDataChange){
                        $scope.onDataChange();
                    }
                });
            };

            $scope.onLoad();
        },
        template: '' +
        '<div class="text-field number-field {{numberFieldClass}}">' +
        '   <div ng-class="{\'input-group field\': !ngDisabled,\'input-group field disabled\': ngDisabled}">' +
        '       <div ng-if="inputIconSupport==\'true\'" class="input-icon {{inputIconCls}}"></div>' +
        '       <input id="{{ngId}}" type="text" name="{{name}}" ng-model="ngModel" ng-change="keyPressValidator()" class="form-control {{input-cls}}" ng-disabled="ngDisabled" ' +
        '               maxlength="{{maxlength}}" autocomplete="off" autocorrect="off" disableautocomplete placeholder="{{placeholder}}"' +
        '               ng-blur="onInputBlur()" ng-focus="onInputFocus()"/>' +
        '       <div ng-if="actionBtnSupport==\'true\'" ng-click="actionBtnAction" class="action-btn {{actionBtnCls}}"></div>' +
        '   </div>' +
        '</div>'
    }
}])
;