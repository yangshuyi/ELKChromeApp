angular.module('common.utils').factory('fileUtils', ['$templateRequest', '$q', 'constants', function ($templateRequest, $q, constants) {

    return {
        loadFileByPath: function (filePath) {
            var deferred = $q.defer();
            $templateRequest(filePath).then(function (content) {
                    deferred.resolve(content);
                },
                function (content) {
                    deferred.resolve(null);
                }
            );
            return deferred.promise;
        }
    };

}]);