'use strict';
angular.module('common.components.notify').provider("notifyProvider", [function () {
    return {
        $get: function ($templateRequest, $controller, $rootScope, $compile, $document, $q, $timeout) {
            return {
                //return as promise
                notify: function (messageHtml, duration, speed) {
                    var deferred = $q.defer();
                    messageHtml = messageHtml?messageHtml:'notification';
                    duration = duration ==null?2000:duration;
                    speed = speed==null?1:speed;

                    var $notifyScope = null;
                    var $element = null;

                    var onLoad = function(){
                        var html = ''+
                            '<div class="notify">' +
                            '   <div class="icon close-icon cursor-pointer" ng-click="close()"></div>'+
                            '   <div class="message">'+messageHtml +'</div>'+
                            '</div>';
                        var template = angular.element(html);
                        $notifyScope = $rootScope.$new();

                        $element = $compile(template)($notifyScope);
                        $('body').append($element);

                        $element.css('top', -1 * $element.outerHeight(true));
                        $element.css('visibility', 'visible');


                        $notifyScope.close = function(){
                            $element.remove();
                        };
                    };

                    var init = function(){
                        $timeout(function () {
                            deferred.resolve($notifyScope);

                           //设置动画样式
                            $element.css('transition','top '+speed+'s');
                            $element.css('top',0);

                            $timeout(function () {
                                //展示完毕，等待n秒
                                if (duration > 0) {
                                    $timeout(function () {
                                        //关闭元素
                                        $element.css('top', -1 * $element.outerHeight(true));

                                        $timeout(function () {
                                            $element.remove();
                                        }, speed*1000);
                                    }, duration);
                                }
                            }, speed*1000);
                        });


                    };

                    onLoad();
                    init();

                    return deferred.promise;
                }
            };
        }
    };
}]);