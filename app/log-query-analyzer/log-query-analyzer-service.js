'use strict';
angular.module('elkChromeApp.logQueryAnalyzerModule').factory("logQueryAnalyzerService", ['$q', 'urlUtils', 'esDaoUtils', 'queryProfileModel', 'queryModel', function ($q, urlUtils, esDaoUtils, queryProfileModel, queryModel) {


    /**
     * 根据条件进行ELK日志查询
     */
    var query = function (queryObj) {
        var deferred = $q.defer();

        esDaoUtils.query(queryObj).then(function (result) {
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
            // _.each(profiles, function (profile) {
            //     if (profile.content['@source'] && _.isArray(profile.content['@source'])) {
            //         _.each(profile.content['@source'], function (source) {
            //             var columnName = source.columnName;
            //             var column = _.find(columns, {columnName: columnName});
            //             if (column) {
            //                 _.assignIn(source, column.defaultSetting);
            //             }
            //         })
            //     } else {
            //         profile.content['@source'] = [];
            //         _.each(columns, function (column) {
            //             var source = column;
            //             _.assignIn(source, column.defaultSetting);
            //
            //             profile.content['@source'].push(source);
            //         });
            //     }
            // });
            deferred.resolve(profiles);
        });
        return deferred.promise;
    };



    return {
        loadQueryProfiles: loadQueryProfiles,
        query: query,
        fetchIndices: fetchIndices,
    };
}]);