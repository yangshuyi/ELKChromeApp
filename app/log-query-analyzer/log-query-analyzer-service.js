'use strict';
angular.module('elkChromeApp.logQueryAnalyzerModule').factory("logQueryAnalyzerService", ['$q', 'urlUtils', 'esDaoUtils', 'queryProfileModel', 'queryModel', function ($q, urlUtils, esDaoUtils, queryProfileModel, queryModel) {


    /**
     * 根据条件进行ELK日志查询
     */
    var query = function (env, queryObj) {
        var deferred = $q.defer();

        esDaoUtils.query(env, queryObj).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    /**
     * 查询索引下的所有的列
     * @returns {Promise}
     */
    var fetchIndices = function () {
        var deferred = $q.defer();

        esDaoUtils.fetchIndices().then(function (columns) {
            var result = queryModel.setIndexColumns(columns);
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    var loadQueryProfiles = function () {
        var deferred = $q.defer();

        var columns = queryModel.getIndexColumns();

        queryProfileModel.loadProfileModels().then(function (profiles) {
            deferred.resolve(profiles);
        });
        return deferred.promise;
    };


    var getQueryEnv = function(content){
        return queryModel.getQueryTerm(content, 'ENV');
    };

    var getQueryApp = function(content){
        return queryModel.getQueryTerm(content, 'APP');
    };

    var getQueryHost = function(content){
        var resultObj = queryModel.getQueryPrefix(content, 'host');
        _.each(resultObj.positive, function(item, idx){
            resultObj.positive[idx] = item.substring(0, item.indexOf(":"));
        });
        _.each(resultObj.nagtive, function(item, idx){
            resultObj.nagtive[idx] = item.substring(0, item.indexOf(":"));
        });
        return resultObj;
    };

    return {
        loadQueryProfiles: loadQueryProfiles,
        query: query,
        getQueryEnv: getQueryEnv,
        getQueryApp: getQueryApp,
        getQueryHost: getQueryHost,
        fetchIndices: fetchIndices,
    };
}]);