angular.module('common.components.loadingMask').directive('loadingMask', ['$rootScope', 'loadingMaskProvider', function ($rootScope, loadingMaskProvider) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
        },
        link: function (scope, element, attrs) {
            scope.queryMessage = scope.message;
            loadingMaskProvider.setLoadingInstance(function (status, msg) {
                if (status == 1) {
                    scope.message = msg || '请稍候。。。';
                    angular.element(".loading-mask").css("display", "flex");
                }else{
                    scope.message = '';
                    angular.element(".loading-mask").css("display", "none");
                }
            });
        },
        template: '' +
        '<div class="loading-mask">' +
        '       <div class="blank"/>' +
        '       <img class="loading-mask-img" src="images/loading-mask-image.gif"/>' +
        '       <span class="loading-mask-msg">{{message}}</span>' +
        '       <div class="blank"/>' +
        '   </div>' +
        '</div>'
    }
}]);
