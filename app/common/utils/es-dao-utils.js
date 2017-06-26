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
    };

    /**
     * query log
     */
    function query(env, hostIps, queryContent) {
        var param = JSON.parse(JSON.stringify(queryContent));
        _.each(param['@filter']['and'], function(elem){
            if(elem['term']){
                //"term": {"COMMON_REQ_CLIENT_IP.raw": ""}
                _.each(elem['term'], function(value, key){
                    if(value){
                        param['filter']['and'].push(elem);
                    }
                });
            }
            if(elem['range']){
                //"range": {"@timestamp": {"gt": "2017-06-03T06:40:16.515Z"}}
                _.each(elem['range'], function(value, key){
                    if(value && (value.gt || value.gte || value.lt || value.lte)){
                        param['filter']['and'].push(elem);
                    }
                });
            }
             //TODO 需要扩展其他逻辑
        });
        param = _.omit(param, ['@sources', '@filter']);

        if(env){
            if(param.filter.and == null){
                param.filter.and = [];
            }
            param.filter.and.push({"term": {"ENV.raw": env}});
        }
        if(hostIps){
            if(param.filter.and == null){
                param.filter.and = [];
            }
            var or = [];
            var ips = hostIps.split(',');
            _.each(ips, function(ip){
                or.push({"prefix": {"host.raw": ip}});
            });
            param.filter.and.push({"or":or});
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