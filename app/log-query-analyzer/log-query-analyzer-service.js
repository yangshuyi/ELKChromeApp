'use strict';
angular.module('elkChromeApp.logQueryAnalyzerModule').factory("logQueryAnalyzerService", ['$q', 'urlUtils', 'esDaoUtils', 'fileUtils', 'constants', function ($q, urlUtils, esDaoUtils, fileUtils, constants) {

    return {
        loadQueryProfiles: loadQueryProfiles,
        query: query,
        fetchIndices: fetchIndices,
    };

    /**
     *
     */
    function query(queryText) {
        var deferred = $q.defer();

        esDaoUtils.query(queryText).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    function fetchIndices() {
        var deferred = $q.defer();

        esDaoUtils.fetchIndices().then(function (columnMap) {
            deferred.resolve(columnMap);
        });
        return deferred.promise;
    };

    function loadQueryProfiles() {
        var list = [];
        list.push({name: 'DRP-用户请求查询', filePath: 'query-profiles/2.json', content: null});
        list.push({name: 'PARTS-PIT请求处理', filePath: 'query-profiles/1.json', content: null});

        var promiseArray = [];
        _.each(list, function (item) {
            var promise = fileUtils.loadFileByPath(item.filePath);

            promiseArray.push(promise);
        });

        var deferred = $q.defer();
        $q.all(promiseArray).then(function (results) {
            _.each(results, function (result, index) {
                list[index].content = result;
            });
            deferred.resolve(list);
        });
        return deferred.promise;
    }
}]);