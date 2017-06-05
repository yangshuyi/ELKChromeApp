angular.module('common.utils').factory('urlUtils', ['$location', 'Restangular', '$window', '$q', 'constants', function ($location, Restangular, $window, $q, constants) {
    var rootPath;
    var dialogProvider;

    return {
        setAppErrorDialogProvider: setAppErrorDialogProvider,
        getPath: getPath,
        setRootPath: setRootPath,
        postJsonData: postJsonData,
        postFormData: postFormData,
        getJsonData: getJsonData,
        getFormData: getFormData,
    };

    function setAppErrorDialogProvider(appErrorDialogProvider) {
        dialogProvider = appErrorDialogProvider;
    }

    function setRootPath(_rootPath){
        Restangular.setBaseUrl(_rootPath);
    }

    function getPath(path) {
        return path;
    }

    /**
     * 提交json数据
     */
    function postJsonData(url, jsonObj) {
        var deferred = $q.defer();
        Restangular.all(this.getPath(url)).post(jsonObj, {}, {'Content-Type': 'application/json; charset=UTF-8'}).then(
            function (result) {
                dataErrorHandler(result);
                deferred.resolve(result);
            }, function (result) {
                httpErrorHandler(result);
            });
        return deferred.promise;
    }

    /**
     * 提交json数据
     */
    function getJsonData(url, jsonObj) {
        var deferred = $q.defer();
        Restangular.all(this.getPath(url)).get(jsonObj, {}, {'Content-Type': 'application/json; charset=UTF-8'}).then(
            function (result) {
                dataErrorHandler(result);
                deferred.resolve(result);
            }, function (result) {
                httpErrorHandler(result);
            });
        return deferred.promise;
    }

    /**
     * 提交Form数据
     */
    function postFormData(url, jsonObj) {
        var deferred = $q.defer();
        var params = getUrlParam(jsonObj);
        Restangular.all(this.getPath(url)).post(params, {}, {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}).then(
            function (result) {
                dataErrorHandler(result);
                deferred.resolve(result);
            }, function (result) {
                httpErrorHandler(result);
            });
        return deferred.promise;
    }

    /**
     * 提交Form数据
     */
    function getFormData(url, jsonObj) {
        var deferred = $q.defer();
        var params = getUrlParam(jsonObj);
        Restangular.all(this.getPath(url)).get(params, {}, {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}).then(
            function (result) {
                dataErrorHandler(result);
                deferred.resolve(result);
            }, function (result) {
                httpErrorHandler(result);
            });
        return deferred.promise;
    }

    function getUrlParam(params) {
        if(params==null){
            return '';
        }
        var param = '';
        _.each(params, function (i, val) {
            param += val + '=' + i + '&';
        });
        if (param) {
            param = param.substring(0, param.length - 1);
        }
        return param;
    }

    /**
     * 系统处理出错的情况
     */
    function dataErrorHandler(data) {
        if (data.result == constants.RESULT.SUCCESS) {
            return;
        }
        if(data.result==null && Object.prototype.toString.call(data) === "[object String]" && data.indexOf('partsApp')>0){
            //100%是因为session失效
            if(dialogProvider) {
                dialogProvider.showAppErrorDialog("您的操作已超时，系统将自动退出。").then(function($dialogScope){
                    $dialogScope.onDialogClose = function(){
                        window.location.href = getPath('');
                    }
                });
            }
        }
        //需要处理的系统异常情况
        if (data.result == constants.RESULT.FAILURE) {
            if (data.code == '1') {
                //您操作的订单不是最新数据，请重新打开订单后再修改。
                if(dialogProvider) {
                    dialogProvider.showAppErrorDialog(data.message);
                }
            }else if (data.code == '2') {
                //您没有权限查看订单。
                if(dialogProvider) {
                    dialogProvider.showAppErrorDialog(data.message);
                }
            } else {
                console.error("http error:"+data);
                if(dialogProvider) {
                    dialogProvider.showAppErrorDialog(data.message);
                }
            }
        }
    };

    /**
     * 网络等无法handle的系统异常情况(SpringMVC对异常的封装)
     */
    function httpErrorHandler(data) {
        if (data.status == 500) {
            if(dialogProvider){
                dialogProvider.showAppErrorDialog("服务器异常。");
            }
            console.log(data.statusText);
        } else {
            console.error(data.statusText);
        }
    }
}]);