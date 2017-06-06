'use strict';
angular.module('elkChromeApp.logQueryAnalyzerModule').controller('logQueryAnalyzerCtrl', ['$scope', '$rootScope', '$state', '$timeout', '$window', 'constants', 'commonDialogProvider', 'dialogProvider'
    , 'esDaoUtils', 'logQueryAnalyzerService'
    , function ($scope, $rootScope, $state, $timeout, $window, constants, commonDialogProvider, dialogProvider
        , esDaoUtils, logQueryAnalyzerService) {
        /**
         * 页面加载逻辑
         */
        $scope.onLoad = function () {
            $rootScope.title = 'ELK Chrome APP - Log Query Analyzer';

            $scope.model = {};

            $scope.columnGridApi = {};
            $scope.columnGridOptions = {
                rowCheckable: true,
                multiRowCheckable: true,
                rowSelectable: true,
                paginationSupport: false,
                fixedHeightFlag: true,
                noDataMessage: '没有找到匹配的结果。',
                columnDefs: [
                    {
                        field: 'displayName',
                        displayName: '显示字段列表',
                        enableSorting: false,
                        cellTemplate: "<div style='width: 230px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;' title='{{row.displayName}}'>{{row.displayName}}</div>",
                    }
                ]
            };

            $scope.resultColumnDefs = [];

            $scope.gridApi = {};
            $scope.gridOptions = {
                rowCheckable: true,
                multiRowCheckable: true,
                rowSelectable: true,
                paginationSupport: true,
                useExternalPagination: true,
                fixedHeightFlag: false,
                noDataMessage: '没有找到匹配的结果。',
                columnDefs: []
            };

            $(window).resize(function () {
                $scope.resizeLayout();
            });


            $scope.init();
        };

        $scope.init = function () {
            esDaoUtils.fetchIndices().then(function (columnMap) {
                $scope.columnMap = columnMap;
                var columns = [];
                _.each(columnMap, function (value, key) {
                    columns.push(value);
                });
                columns = _.sortBy(columns, 'displayName');

                $scope.columnGridApi.setGridData(columns, columns.length);

                $scope.columnGridApi.resizeGridLayout($(window).width(), $(window).height() - 45);
            });

            $scope.userProfiles = [];

            logQueryAnalyzerService.loadQueryProfiles().then(function(profiles){
                $scope.model.userProfiles = profiles;
            });

            $scope.resizeLayout();
        };

        $scope.onColumnChanged = function(){
            var selectedColumns = $scope.columnGridApi.getCheckedRows();

            var columnDefs = [];
            _.each(selectedColumns, function(column){
                var columnDef = {
                    field: column.name,
                    displayName: column.caption,
                    enableSorting: false,
                    cellTemplate: "<div title='{{row[col.field]}}'>{{row[col.field]}}</div>",
                };
                columnDefs.push(columnDef);
            });
            $scope.gridOptions.columnDefs = columnDefs;
        };

        $scope.openQueryConditionDialog = function () {
            dialogProvider.openDialog({
                    templateUrl: 'app/log-query-analyzer/query-condition-dialog.html',
                    controllerName: 'queryConditionDialogCtrl',
                    resolves: {
                        data: {queryText: $scope.model.selectUserProfile.content}
                    },
                    options: {
                        title: '查询条件',
                        width: "800px",
                        height: "600px",
                        modal: true,
                        collapsible: false,
                        enableDrag: true,
                        dialogCls: ''
                    }
                }
            ).then(function ($dialogScope) {
                $dialogScope.onDialogClose = function () {
                    if ($dialogScope.result != null) {
                        $scope.model.selectUserProfile.content = $dialogScope.result;
                        $scope.query($scope.model.selectUserProfile.content);
                    }
                };
            });
        };

        $scope.query = function (queryText) {
            logQueryAnalyzerService.query(queryText).then(function (rows) {

                commonDialogProvider.alert("find " + rows.length + " record(s)");
            });
        };


        $scope.resizeLayout = function () {
            $timeout(function () {

            });
        };

        $scope.onLoad();
    }]);
