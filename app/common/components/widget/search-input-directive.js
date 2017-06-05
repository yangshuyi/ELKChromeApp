'use strict';
angular.module('common.components.widget')
    .directive('searchField', ['$timeout', function ($timeout) {
        return {
            restrict: 'EA',
            scope: {
                inputValue: '=ngModel',
                placeholder: "@",
                searchEvent: "=",
                bindKeyUpEvent: "=",
                initStyle: "@"
            },
            link: function ($scope, $element) {
                $scope.plcHolder = $scope.placeholder || '请输入关键字';
                /**
                 * 绑定回车键事件
                 */
                $scope.bindKeyPressEvent = function () {
                    if (event && event.which == 13) {
                        $scope.searchEvent.apply(this, [$scope.inputValue, true]);
                    }
                };

                /**
                 * 绑定点击放大镜的查询按钮事件
                 */
                $scope.bindClickEvent = function () {
                    $scope.searchEvent.apply(this, [$scope.inputValue, true]);
                };

                /**
                 * 绑定点击“叉号”后的清除事件
                 */
                $scope.bindReturnSearch = function () {
                    $scope.inputValue = '';
                    //必须延迟，否则清除输入框，立刻执行查询，查询的方法不能获取到清除的数据。
                    $timeout(function () {
                        $scope.searchEvent.apply(this, [$scope.inputValue, false]);
                    }, 0);

                };

                /**
                 * 监控输入框，如果输入框有值，则显示叉号，否则不显示
                 */
                $scope.$watch('inputValue', function (newVal, oldVal) {
                    if (newVal == null || newVal == "") {
                        $scope.showIcon = "0";
                    } else {
                        $scope.showIcon = "1";
                    }
                });
            },
            template: '{{configFilterInput}}<div class="input-group" style="{{initStyle}}">\
                                        <input no-dirty-check type="text" class="form-control text-height" ng-model="inputValue" placeholder="{{plcHolder}}" class="search-input" ng-keydown="bindKeyPressEvent()" ng-keyup="bindKeyUpEvent(inputValue)">\
                                        <span ng-show="inputValue" class="glyphicon glyphicon-remove filter-clean-btn" ng-click="bindReturnSearch()"></span>\
                                        <span class="input-group-btn">\
                                            <button class="btn btn-default text-height" type="button" ng-click="bindClickEvent()">\
                                                <span class="glyphicon glyphicon-search" aria-hidden="true"></span>\
                                            </button>\
                                        </span>\
                                    </div>'
        }
    }]);