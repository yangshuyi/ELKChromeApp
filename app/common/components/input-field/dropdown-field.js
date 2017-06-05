'use strict';
angular.module('common.components.inputField').directive('dropdownField', ['$q', '$timeout', function ($q, $timeout) {
    return {
        require: 'ngModel',
        restrict: 'E',
        replace: false,
        scope: {
            ngId: '@', //input id值
            ngModel: '=',
            searchTitle: '@',
            ngDisabled: '@',    //是否disable
            searchEnabled: '@', //是否支持option查询
            optionList: "=",    //option列表
            optionText: '@',    //option的对象显示的TEXT文本属性
            optionValue: '@',   //option的对象对应的VALUE属性
            beforeOptionSelected: '=',//选中option之前触发
            onAfterOptionSelected: '=',//选中option之后触发
        },
        link: function ($scope, $element, $attrs, ngModelCtrl) {
            $scope.options = [];
            $scope.uiSelectModel = {selectedOption: null};
            $scope.onLoad = function () {
                //外部更新下拉列表的值
                ngModelCtrl.$formatters.push(function (selectedOption) {
                    if (selectedOption != $scope.uiSelectModel.selectedOption) {
                        $scope.selectOption(selectedOption);
                    }
                    return selectedOption;
                });

                //下拉列表选项发生变动
                $scope.$watch('optionList', function () {
                    _.each($scope.optionList, function (option) {
                        option['$_dropdownField_text'] = option[$scope.optionText];
                    });
                    $scope.selectOption($scope.ngModel);
                });

                $timeout(function(){
                    $('i.pull-right', $element).attr('class','icon dropdown-icon');
                    $('i.pull-right', $element).attr('class','icon dropdown-icon');
                })
            };

            /**
             * 用户操作，选中某个选项
             */
            $scope.onOptionSelected = function (currentSelectedOption) {
                var beforeOptionSelectedFunc = $scope.beforeOptionSelected || function () {
                        return true;
                    };
                var onAfterOptionSelectedFunc = $scope.onAfterOptionSelected || function () {
                        return true;
                    };

                $q.when(beforeOptionSelectedFunc(currentSelectedOption)).then(function (confirmed) {
                    if (confirmed == true) {
                        //应用当前的值
                        $scope.ngModel = currentSelectedOption;
                        $q.when(onAfterOptionSelectedFunc(currentSelectedOption)).then(function () {
                        });
                    } else {
                        //回退之前的值
                        $scope.selectOption($scope.ngModel);
                    }
                });
            };

            /**
             * 模型操作，选中某个选项
             */
            $scope.selectOption = function (selectedOption) {
                var availableOption = null;
                if (selectedOption == null) {
                    //寻找默认值
                    var found = _.find($scope.optionList, function (option) {
                        return option[$scope.optionValue] == null;
                    });
                    if (found) {
                        availableOption = found;
                    }
                } else {
                    var found = _.find($scope.optionList, function (option) {
                        return selectedOption[$scope.optionValue] == option[$scope.optionValue];
                    });
                    if (found) {
                        availableOption = found;
                    }
                }
                $scope.uiSelectModel.selectedOption = availableOption;
            };
            $scope.onLoad();
        },
        template: '' +
        '<ui-select ng-model="uiSelectModel.selectedOption" ng-disabled="{{ngDisabled}}" on-select="onOptionSelected(uiSelectModel.selectedOption)" append-to-body="true" search-enabled="{{searchEnabled}}" theme="bootstrap"> ' +
        '   <ui-select-match placeholder="{{searchTitle}}">' +
        '       <span ng-bind-html="uiSelectModel.selectedOption.$_dropdownField_text"></span>' +
        '   </ui-select-match>' +
        '   <ui-select-choices repeat="item in (optionList | dropdownFieldOptionFilter: {$_dropdownField_text: $select.search})">' +
        '       <span ng-bind-html="item.$_dropdownField_text| highlight: $select.search"></span>' +
        '    </ui-select-choices>' +
        '</ui-select>'
    }
}]);

angular.module('common.components.inputField').filter('dropdownFieldOptionFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop]) {
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});