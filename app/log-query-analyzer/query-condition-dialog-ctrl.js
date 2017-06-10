'use strict';
angular.module('elkChromeApp.logQueryAnalyzerModule').controller('queryConditionDialogCtrl', ['$scope', '$q', 'constants', 'commonDialogProvider', 'queryProfile',
    function ($scope, $q, constants, commonDialogProvider, queryProfile) {
        $scope.onLoad = function () {
            var queryText = JSON.stringify(queryProfile.content);

            $scope.model = {queryText: queryText}
        };

        $scope.verify = function(){
            var parseErrorMsg = null;
            var obj = null;
            try{
                obj = JSON.parse($scope.model.queryText);
            }
            catch(e){
                parseErrorMsg=e;
            }
            if(parseErrorMsg){
                commonDialogProvider.alert("Parse JSON error");
                return null;
            }
            return obj;
        };

        /**
         *
         */
        $scope.confirm = function () {
            var obj = $scope.verify();
            if(obj){
                $scope.result = obj;
                $scope.dialogApi.close();
            }
        };

        /**
         *
         */
        $scope.cancel = function () {
            $scope.result = null;
            $scope.dialogApi.close();
        };

        $scope.onLoad();
    }]
);
