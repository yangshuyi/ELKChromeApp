'use strict';
angular.module('common.components.widget')
    .directive('textArea', ['$timeout', function ($timeout) {
        return {
            scope: {
                maxLength: '@',
                text: '=',
                length: '=',
                height: '@',
                ngDisabled: '@'
            },
            bindToController: true,
            controllerAs: 'ctrl',
            controller: ['$scope', function ($scope) {
                $scope.$watch(
                    angular.bind(this, function (text) {
                        return this.text
                    }),
                    angular.bind(this, function (newVal) {
                        // TODO 当以dialog形式打开的，例如损失项目的备注 该方法会访问2次，第一次的this.text为undefined 导致JS报错。具体原因待查
                        //this.length = this.text.length;
                        var that = this;
                        $timeout(function () {
                            if (that.text && that.text.trim().length == 0) {
                                that.text = "";
                            }
                            that.length = that.text ? that.text.replace(/\n/g, '11').length : 0;
                            if (that.length > that.maxLength) {
                                that.text = that.text.substring(0, that.text.length - (that.length - that.maxLength));
                                that.length = that.maxLength;
                            }
                        }, 0);
                    }))
            }],
            template: '<textarea ng-trim="false" style="height: {{ctrl.height}}"  ng-disabled="{{ctrl.ngDisabled}}" maxlength="{{ctrl.maxLength}}" ng-model="ctrl.text" class="form-control text-area"></textarea>'
        }
    }]);
