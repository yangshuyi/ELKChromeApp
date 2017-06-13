angular.module('common.businessComponents.model').factory('queryProfileModel', ['fileUtils', '$q', function (fileUtils, $q) {
    var constructor = function (name, filePath) {
        return {
            name: name,
            filePath: filePath,
            content: null
        }
    };

    var loadProfileModels = function () {
        var list = [];
        list.push(constructor('DRP-用户请求查询', 'query-profiles/DRP/Flow/User_Request_Flow.json'));

        list.push(constructor('DRP-BatchJob日志查询', 'query-profiles/DRP/BatchJob/Batch_Job_Flow.json'));
        list.push(constructor('DRP-BatchJob执行时间分析', 'query-profiles/DRP/BatchJob/Batch_Job_Execution_Timing.json'));
        list.push(constructor('DRP-BatchJob执行数量分析', 'query-profiles/DRP/BatchJob/Batch_Job_Execution_Count.json'));

        list.push(constructor('DRP-规则日志查询', 'query-profiles/DRP/Rule/Rule_Audit_Report.json'));


        list.push(constructor('INTERFACE-日志查询', 'query-profiles/INTERFACE/Request_Flow.json'));

        list.push(constructor('PARTS-用户请求处理', 'query-profiles/PARTS/Flow/User_Request_Flow.json'));

        list.push(constructor('PARTS-PIT请求处理', 'query-profiles/PARTS/PIT/PIT_Import_Request_Flow.json'));
        list.push(constructor('PARTS-PIT数据处理', 'query-profiles/PARTS/PIT/PIT_Import_Process_Quartz_Task.json'));

        var promiseArray = [];
        _.each(list, function (item) {
            var promise = fileUtils.loadFileByPath(item.filePath);
            promiseArray.push(promise);
        });

        var deferred = $q.defer();
        $q.all(promiseArray).then(function (results) {
            _.each(results, function (result, index) {
                list[index].content = JSON.parse(result);
            });
            deferred.resolve(list);
        });
        return deferred.promise;
    };


    return {
        loadProfileModels: loadProfileModels
    };
}]);
