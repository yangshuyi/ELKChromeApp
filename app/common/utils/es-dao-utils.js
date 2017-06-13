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
    function query(env, queryContent) {
        var param = JSON.parse(JSON.stringify(queryContent));
        param = _.omit(param, ['@sources']);

        if(env){
            if(param.query.bool.must == null){
                param.query.bool.must = []
            }
            param.query.bool.must.push({"term": {"ENV.raw": env}});
        }

        var deferred = $q.defer();
        var url = "/_search";
        urlUtils.postJsonData(url, param).then(function (result) {
            if (result.hits.total == 0) {
                return deferred.resolve([]);
            } else {
                var datas = result.hits.hits;
                var rows = [];
                _.each(datas, function (data) {
                    var row = _.get(data, '_source', null);
                    row['@timestamp'] = moment(new Date(row['timestamp'])).format('YYYY-MM-DD HH:mm:ssSSS');
                    rows.push(row);
                });
                return deferred.resolve(rows);
            }
        });

        return deferred.promise;
    };

    /**
     * 获取logstash的索引列
     */
    function fetchIndices() {
        var defaultColumns = ['@timestamp', 'APP', 'priority', 'MSG'];
        var indexNamePrefix = 'logstash-log4j-json-';

        var url = "/_cluster/state";
        return urlUtils.getFormData(url, null).then(function (result) {
            var columns = [];

            if (result.metadata.indices) {
                var indices = result.metadata.indices;
                _.each(result.metadata.indices, function (indexObj, key) {
                    if (!_.startsWith(key, indexNamePrefix)) {
                        return;
                    }
                    var properties = _.get(indexObj, 'mappings.log4j-json.properties', null); 
                    _.each(properties, function (propertyObj, key) {
                        propertyObj.columnName = key;
                        propertyObj.fieldIndex = _.get(propertyObj, 'fields.raw.index', null);
                        columns.push(propertyObj);
                    });
                });
                return $q.when(columns);
            } else {
                return $q.when(columns);
            }

        });

    }
}]);