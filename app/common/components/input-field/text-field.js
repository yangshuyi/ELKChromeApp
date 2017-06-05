'use strict';
angular.module('common.components.inputField').directive('textField', ['$timeout' ,'$templateCache', function ($timeout, $templateCache) {
        var INPUT_TYPE_ARRAY = [
            {key: 'text', type:'text', len: 60, pattern: '', description: ''},
            {key: 'name', type:'text', len: 60, pattern: /[&\|\\\*^%$#@\-]/g, description: "姓名,联系人,合同联系人"},
            {key: 'url', type: 'url', len: 60, pattern: '', description: "URL类型"},
            {key: 'address', type: 'text', len: 500, pattern: /[&\|\\\*^%$#@\-]/g, description: '地址'},
            {key: 'tel', type:'tel', len: 20, pattern: /^(\d|\-|\(|\)|\s)*$/, description: '电话号码，手机号'},
            {key: 'email', type:'email', len: 20, pattern: '', description: '邮件'},
            {key: 'captcha', type:'text', len: 4, pattern: '', description: ''},
            {key: 'orderNo', type: 'text', len: 100, pattern: /[^a-zA-Z0-9/\s/g]/g, description: ''},
        ];

        var getInputTypeByKey = function (type) {
            var type = _.find(INPUT_TYPE_ARRAY, {key: type});
            if (type == null) {
                return _.find(INPUT_TYPE_ARRAY, {key: 'text'});
            }
            return type;
        };

        return {
            require: 'ngModel',
            scope: {
                ngId: '@',
                ngModel: '=',
                type: '@',
                placeholder:'@',
                ngDisabled: '=',
                textFieldClass: '@',

                onDataChanged: '&',

                actionCaption: '@',
                actionBtnSupport: '@',
                actionBtnAction: '='
            },
            replace: true,

            link: function ($scope, $element, $attrs, $ngModelCtrl) {
                $scope.type  = $scope.type || 'text';
                $scope.inputType = getInputTypeByKey($scope.type);

                $scope.onLoad = function(){
                    $ngModelCtrl.$formatters.push(function (v) {
                        if ($scope.type != 'tel' && $scope.type != 'number' && $scope.type != 'url') {
                            //except the type of tel,number and url
                            if ($scope.inputType.pattern) {
                                if (v) {
                                    v = v.replace($scope.inputType.pattern, "");
                                }
                            }
                        }
                        $scope.ngModel = v;
                    });

                    $scope.$watch('ngModel', function (newVal, oldVal) {
                        //format the type of tel or number
                        if ($scope.type === 'tel') {
                            if (newVal != null && newVal != "" && newVal.trim() != null) {
                                if ($scope.inputType.pattern.test(newVal)) {
                                    $scope.ngModel = newVal;
                                } else {
                                    $scope.ngModel = oldVal;
                                }
                            }
                        }
                        //针对不同的控件类型，特殊处理
                        if ($scope.type === 'url') {
                            // if the type of url is invalidate,then setting the resultValue to null.
                            if ($scope.ngModel != null && $scope.ngModel != "" && $scope.ngModel.trim() != null) {
                                if (!$scope.inputType.pattern.test($scope.ngModel)) {
                                    $scope.ngModel = '';
                                }
                            }
                        }
                    });
                };

                /**
                 * 焦点选中Input元素时，将焦点设置到外部DIV边框上
                 */
                $scope.onInputFocus = function(){
                    $('.field',$element).addClass('focus');
                    $('.form-control',$element).select();
                };

                /**
                 * 焦点移出Input元素时，去除外部DIV边框的焦点效果
                 */
                $scope.onInputBlur = function(){
                    $('.field',$element).removeClass('focus');

                };

                $scope.onLoad();
            },
            template: ''+
            '<div class="text-field {{textFieldClass}}">'+
            '   <div ng-class="{\'input-group field disabled\': ngDisabled,\'input-group field\': !ngDisabled}">'+
            '       <input id="{{ngId}}" type="{{inputType.type}}" ng-model="ngModel" class="form-control {{input-cls}}" ng-disabled="ngDisabled" ' +
            '               maxlength="{{inputType.len}}" autocomplete="off" autocorrect="off" disableautocomplete placeholder="{{placeholder}}"'+
            '               ng-change="onDataChanged()" ng-blur="onInputBlur()" ng-focus="onInputFocus()"/>'+
            '         <span class="input-group-btn">'+
            '           <button ng-if="actionBtnSupport==\'true\'" ng-click="actionBtnAction()" class="btn btn-default action-btn {{actionBtnCls}}" type="button">{{actionCaption}}</button>'+
            '         </span>'+
            '   </div>'+
            '</div>'
        }
    }])
;