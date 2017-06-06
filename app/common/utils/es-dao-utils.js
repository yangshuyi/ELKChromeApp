'use strict';
angular.module('common.utils').factory("esDaoUtils", ['$q', 'urlUtils', 'constants', function ($q, urlUtils, constants) {

    return {
        connectToEs: connectToEs,
        query: query,
        fetchIndices: fetchIndices,
    };

    function connectToEs() {
        var deferred = $q.defer();
        urlUtils.getFormData('/', null).then(function (data) {
            if (data.cluster_name) {
                deferred.resolve(data.cluster_name);
            } else {
                deferred.resolve(null);
            }
        });
        return deferred.promise;
    }

    /**
     * query log
     */
    function query(queryText) {
        var deferred = $q.defer();
        var url = "/_search";
        urlUtils.postJsonData(url, JSON.parse(queryText)).then(function (result) {
            if (result.hits.total == 0) {
                return $q.when([]);
            } else {
                var datas = result.hits.hits;
                var rows = [];
                _.each(datas, function (data) {
                    rows.push(data);
                });
                return $q.when(rows);
            }
        });

        return deferred.promise;
    };

    /**
     * 获取logstash的索引列
     */
    function fetchIndices() {
        var indexNamePrefix = 'logstash-log4j-json-';

        var url = "/_cluster/state";
        return urlUtils.getFormData(url, null).then(function (result) {
            var columnMap = {};

            if (result.metadata.indices) {
                var indices = result.metadata.indices;
                _.each(result.metadata.indices, function (indexObj, key) {
                    if (!_.startsWith(key, indexNamePrefix)) {
                        return;
                    }
                    var properties = _.get(indexObj, 'mappings.log4j-json.properties', null); 
                    _.each(properties, function (propertyObj, key) {
                        columnMap[key] = {};
                        columnMap[key].columnName = key;
                        columnMap[key].columnType = propertyObj.type;
                        columnMap[key].fieldIndex = _.get(propertyObj, 'fields.raw.index', null);

                        columnMap[key].displayName = columnMap[key].columnName + '[' + columnMap[key].columnType + ']';
                        columnMap[key].caption = columnMap[key].columnName;
                    });
                });
                return $q.when(columnMap);
            } else {
                return $q.when(columnMap);
            }

        });

    }
}]);