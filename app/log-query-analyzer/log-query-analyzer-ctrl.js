'use strict';
angular.module('elkChromeApp.logQueryAnalyzerModule').controller('logQueryAnalyzerCtrl', ['$scope', '$rootScope', '$state', '$timeout', '$window', 'constants', 'commonDialogProvider', 'dialogProvider', 'logQueryAnalyzerService',
    function ($scope, $rootScope, $state, $timeout, $window, constants , commonDialogProvider, dialogProvider, logQueryAnalyzerService) {
        /**
         * 页面加载逻辑
         */
        $scope.onLoad = function () {
            $rootScope.title = 'ELK Chrome APP - Log Query Analyzer';

            $scope.queryText = '';

            $scope.gridApi = {};
            $scope.gridOptions = {
                rowCheckable: true,
                multiRowCheckable: true,
                rowSelectable: true,
                paginationSupport: true,
                useExternalPagination: true,
                fixedHeightFlag: false,
                noDataMessage: '没有找到匹配的结果。',
                columnDefs: [
                    {
                        field: 'seriesName',
                        displayName: '车系',
                        enableSorting: false,
                    },
                    {
                        field: 'repairFactoryName',
                        displayName: '修理厂',
                        enableSorting: false
                    },
                    {
                        field: 'orderNo',
                        displayName: '订单编号',
                        enableSorting: false,
                        cellTemplate: "<div ng-click='appScope.openOrder(row)' class='orderNo'><a>{{row.orderNo}}</a></div>",
                    },
                    {
                        field: 'createDate',
                        displayName: '下单日期',
                        headStyle: {width:'250px'},
                        enableSorting: true,
                    },
                    {
                        field: 'orderStatus',
                        displayName: '订单状态',
                        enableSorting: false,
                        headStyle: {width:'200px'},
                        cellTemplate: "<div>{{row.orderStatus | codeTableFilter:'PT1006'}}</div>"
                    }
                ]
            };

            $scope.resizeLayout();

            $(window).resize(function () {
                $scope.resizeLayout();
            });
        };

        $scope.openQueryConditionDialog = function(){
            dialogProvider.openDialog({
                    templateUrl: 'app/log-query-analyzer/query-condition-dialog.html',
                    controllerName: 'queryConditionDialogCtrl',
                    resolves: {
                        data:{ queryText: $scope.queryText}
                    },
                    options: {
                        title: '查询条件',
                        width: "800px",
                        height: "300px",
                        modal: true,
                        collapsible: false,
                        enableDrag: true,
                        dialogCls: ''
                    }
                }
            ).then(function ($dialogScope) {
                $dialogScope.onDialogClose = function () {
                    if($dialogScope.result!=null){
                        $scope.queryText = $dialogScope.result;
                        $scope.query($scope.queryText);
                    }
                    deferred.resolve($dialogScope.result);
                }
            });
        };

        $scope.query = function(queryText){
            logQueryAnalyzerService.query(queryText).then(function(rows){
                commonDialogProvider.alert("find "+rows.length+" record(s)");
            });
        };


        $scope.resizeLayout = function () {
            $timeout(function () {

            });
        };

        $scope.onLoad();
    }]);
