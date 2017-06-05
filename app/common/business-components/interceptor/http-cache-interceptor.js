angular.module('common.businessComponents.interceptor').factory('httpCacheInterceptor', ['$q', '$rootScope', 'constants',
    function ($q, $rootScope, $timeout, constants) {
        return {
            request: function (request) {
                var version = _.uniqueId();
                // 包含template/或.tpl.html关键字的请求URL, 表示为模板代码,不是真实的网页,需要过滤不请求服务器
                if (request.url.indexOf('template/')<0 && request.url.indexOf('templates/')<0 && request.url.indexOf('.tpl.html')<0) {
                    if (request.url.indexOf('?')>=0) {
                        request.url += '&_t=' + version;
                    } else {
                        request.url += "?_t=" + version;
                    }
                }
                return $q.when(request);
            }
        }
    }]);