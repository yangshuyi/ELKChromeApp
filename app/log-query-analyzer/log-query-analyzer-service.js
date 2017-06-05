'use strict';
angular.module('elkChromeApp.logQueryAnalyzerModule').factory("logQueryAnalyzerService", ['$q', 'urlUtils', 'constants', function ($q, urlUtils, constants) {

    return {
        query: query,
    };

    /**
     * 登陆逻辑处理
     */
    function query(queryText) {
        var deferred = $q.defer();
        var url = "/_search";
        return urlUtils.postJsonData(url,  JSON.parse(queryText)).then(function (result) {
           if(result.hits.total==0){
               return $q.when([]);
           }else{
               var datas = result.hits.hits;
               var rows = [];
                _.each(datas, function(data){
                    rows.push(data);
                });
               return $q.when(rows);
           }

        });

        return deferred.promise;
    }
}]);