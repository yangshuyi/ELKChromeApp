angular.module('common.businessComponents.model').factory('queryProfileModel', ['fileUtils', '$q', function (fileUtils, $q) {
    var constructor = function (name, filePath) {
        return {
            name: name,
            filePath: filePath,
            content: null,
            contentObj: null
        }
    };

    var loadProfileModels = function () {
        var list = [];
        list.push(constructor('DRP-用户请求查询', 'query-profiles/DRP/Flow/User_Request_Flow.json'));
        list.push(constructor('PARTS-用户请求处理', 'query-profiles/PARTS/Flow/User_Request_Flow.json'));
        list.push(constructor('PARTS-PIT请求处理', 'query-profiles/PARTS/PIT/PIT_Import_Request_Flow.json'));
        list.push(constructor('PARTS-PIT數據处理', 'query-profiles/PARTS/PIT/PIT_Import_Process_Quartz_Task.json'));

        var promiseArray = [];
        _.each(list, function (item) {
            var promise = fileUtils.loadFileByPath(item.filePath);
            promiseArray.push(promise);
        });

        var deferred = $q.defer();
        $q.all(promiseArray).then(function (results) {
            _.each(results, function (result, index) {
                list[index].content = result;
                list[index].contentObj = JSON.parse(result);
            });
            deferred.resolve(list);
        });
        return deferred.promise;
    };


    return {
        loadProfileModels: loadProfileModels
    };
}]);
