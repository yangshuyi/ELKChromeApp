'use strict';
angular.module('elkChromeApp.logQueryAnalyzerModule').factory("logQueryAnalyzerService", ['$q', 'urlUtils', 'esDaoUtils', 'queryProfileModel', 'queryModel', function ($q, urlUtils, esDaoUtils, queryProfileModel, queryModel) {

    return {
        loadQueryProfiles: loadQueryProfiles,
        query: query,
        fetchIndices: fetchIndices,
    };

    /**
     *
     */
    function query(queryObj) {
        var deferred = $q.defer();

        esDaoUtils.query(queryObj).then(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    function fetchIndices() {
        var deferred = $q.defer();

        esDaoUtils.fetchIndices().then(function (columns) {
            var result = queryModel.setIndexColumns(columns);
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    function loadQueryProfiles(){
        var deferred = $q.defer();

        var columns = queryModel.getIndexColumns();

        queryProfileModel.loadProfileModels().then(function (profiles) {
            _.each(profiles, function(profile){
                if(profile['@source'] && _.isArray(profile['@source'])){
                    _.each(profile['@source'] , function(source){
                        var columnName = source.columnName;
                        var column = _.find(columns, {columnName:columnName});
                        if(column){
                            _.assignIn(source, column.defaultSetting);
                        }
                    })
                }else{
                    profile['@source'] = [];
                    _.each(columns, function(column){
                        var source = column;
                        _.assignIn(source, column.defaultSetting);

                        profile['@source'].push(source);
                    });
                }
            });
            deferred.resolve(profiles);
        });
        return deferred.promise;
    }
}]);