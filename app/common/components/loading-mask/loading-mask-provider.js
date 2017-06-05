'use strict';
/***
 * Loading-Mask的控制API的单例实现
 */
angular.module('common.components.loadingMask').factory('loadingMaskProvider', [function () {
    var status = 0;
    var loadingInstance;

    return {
        start: function (msg) {
            status = 1;
            loadingInstance(status, msg);
        },

        complete: function () {
            status = 0;
            loadingInstance(status);
        },

        status: status,

        setLoadingInstance: function (instance) {
            loadingInstance = instance;
        }
    }
}]);