'use strict';
angular.module('common.businessComponents.bar').directive("footBar", ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        scope: {
            footBarClass: '@'
        },
        template: ''+
        '<div class="foot-bar {{footBarClass}}">' +
        '   <div>'+
        '       <div>北京CCCIS信息技术有限公司&nbsp;|&nbsp;<a class="contact-us-button" href="">联系我们</a></div>' +
        '       <div>网络经营许可证：京ICP备11024601号-12</div>' +
        '       <div>&copy; 2015-2020 Carwise Carwise.com. All Rights Reserved.</div>' +
        '   </div>'+
        '</div> '
    }
}]);