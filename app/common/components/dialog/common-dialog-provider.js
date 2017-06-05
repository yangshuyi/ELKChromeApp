'use strict';
angular.module('common.components.dialog').controller('alertCtrl', ['$scope', 'content', function ($scope, content) {
    $scope.content = content;
    $scope.result = null;
    $scope.closeAlert = function () {
        $scope.result = true;
        $scope.dialogApi.close();
    }
}]);
angular.module('common.components.dialog').controller('appErrorDialogCtrl', ['$scope', 'content', function ($scope, content) {
    $scope.content = content;
    $scope.result = null;
    $scope.closeAlert = function () {
        $scope.result = true;
        $scope.dialogApi.close();
    }
}]);
angular.module('common.components.dialog').controller('confirmCtrl', ['$scope', 'content', 'data', function ($scope, content, data) {
    $scope.content = content;
    $scope.data = data;
    $scope.result = null;
    $scope.confirm = function () {
        $scope.result = true;
        $scope.dialogApi.close();
    };
    $scope.cancel = function () {
        $scope.result = false;
        $scope.dialogApi.close();
    };
}]);
angular.module('common.components.dialog').factory('commonDialogProvider', ['dialogProvider', function (dialogProvider) {
    return {
        alert: function (content, dialogOptions) {
            return dialogProvider.openDialog({
                    templateUrl: 'app/common/components/dialog/common-dialog-alert-tmpl.html',
                    controllerName: 'alertCtrl',
                    resolves: {
                        content: content
                    },
                    options: {
                        title: dialogOptions == null || dialogOptions.title == null ? '注意' : dialogOptions.title,
                        width: dialogOptions == null || dialogOptions.width == null ? '380px' : dialogOptions.width,
                        height: dialogOptions == null || dialogOptions.height == null ? '180px' : dialogOptions.height,
                        modal: true,
                        collapsible: dialogOptions == null || dialogOptions.title == null ? false : dialogOptions.collapsible,
                        enableDrag: dialogOptions == null || dialogOptions.enableDrag == null ? true : dialogOptions.enableDrag,
                        dialogCls: 'common-dialog alert-dialog',
                    }
                }
            );
        },
        confirm: function (content, dialogOptions, data) {
            dialogOptions = dialogOptions || {};
            return dialogProvider.openDialog({
                templateUrl: 'app/common/components/dialog/common-dialog-confirm-tmpl.html',
                controllerName: 'confirmCtrl',
                options: angular.extend({
                    title: dialogOptions == null || dialogOptions.title == null ? '请确认' : dialogOptions.title,
                    width: dialogOptions == null || dialogOptions.width == null ? '380px' : dialogOptions.width,
                    height: dialogOptions == null || dialogOptions.height == null ? '180px' : dialogOptions.height,
                    modal: true,
                    collapsible: dialogOptions == null || dialogOptions.title == null ? false : dialogOptions.collapsible,
                    enableDrag: dialogOptions == null || dialogOptions.enableDrag == null ? true : dialogOptions.enableDrag,
                    dialogCls: 'common-dialog confirm-dialog',
                }, dialogOptions),
                resolves: {
                    data: angular.extend({}, data),
                    content: content
                }
            });
        },

        showAppErrorDialog: function (content, dialogOptions) {
            return dialogProvider.openDialog({
                    templateUrl: 'app/common/components/dialog/common-dialog-alert-tmpl.html',
                    controllerName: 'appErrorDialogCtrl',
                    resolves: {
                        content: content
                    },
                    options: {
                        title: dialogOptions == null || dialogOptions.title == null ? '注意' : dialogOptions.title,
                        width: dialogOptions == null || dialogOptions.width == null ? '380px' : dialogOptions.width,
                        height: dialogOptions == null || dialogOptions.height == null ? '180px' : dialogOptions.height,
                        modal: true,
                        collapsible: dialogOptions == null || dialogOptions.title == null ? false : dialogOptions.collapsible,
                        enableDrag: dialogOptions == null || dialogOptions.enableDrag == null ? true : dialogOptions.enableDrag,
                        dialogCls: 'common-dialog alert-dialog',
                    }
                }
            );
        },
    }
}]);