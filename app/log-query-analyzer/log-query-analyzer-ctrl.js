'use strict';
angular.module('elkChromeApp.logQueryAnalyzerModule').controller('logQueryAnalyzerCtrl', ['$scope', '$rootScope', '$state', '$timeout', '$window', 'constants', 'commonDialogProvider', 'dialogProvider', 'notifyProvider'
    , 'esDaoUtils', 'logQueryAnalyzerService'
    , function ($scope, $rootScope, $state, $timeout, $window, constants, commonDialogProvider, dialogProvider, notifyProvider
        , esDaoUtils, logQueryAnalyzerService) {
        /**
         * 页面加载逻辑
         */
        $scope.onLoad = function () {
            $rootScope.title = 'ELK Chrome APP - Log Query Analyzer';

            $scope.model = {};

            $scope.columnGridApi = {};
            $scope.columnGridOptions = {
                gridHighlightCellStyleFlag: false,
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
                        cellTemplate: "<div style='width: 230px;' class='text-ellipsis' title='{{row.columnName}}'>{{row.columnName}}[{{row.type}}]</div>",
                    }
                ]
            };

            $scope.resultColumnDefs = [];

            $scope.queryResultGridApi = {};
            $scope.queryResultGridOptions = {
                rowSelectable: true,
                columnDefs: []
            };

            $(window).resize(function () {
                $scope.resizeLayout();
            });

            $scope.init();
        };

        $scope.init = function () {
            logQueryAnalyzerService.fetchIndices().then(function (columns) {
                $scope.columns = _.sortBy(columns, 'columnName');

                $scope.columnGridApi.setGridData($scope.columns, columns.length);

                logQueryAnalyzerService.loadQueryProfiles().then(function (profiles) {
                    $scope.model.queryProfiles = profiles;
                });
            });

            $scope.resizeLayout();
        };

        $scope.onColumnChanged = function () {
            if ($scope.model.selectedQueryProfile == null) {
                return;
            }

            var profile = $scope.model.selectedQueryProfile;
            _.each(profile['@source'], function (source) {
                var column = _.find($scope.columns, {columnName: source});
                if (column) {
                    profile['@source'].$checked = column.$checked;
                }
            });
            $scope.renderQueryResultGrid(profile);
        };

        $scope.onQueryProfileSelected = function (profile) {
            if (profile == null) {
                return;
            }

            $scope.columnGridApi.checkAllRows(false, true);

            //重设左边的显示列
            _.each(profile['@source'], function (source) {
                var column = _.find($scope.columns, {columnName: source});
                if (column) {
                    column.$checked = true;
                }
            });
            $scope.renderQueryResultGrid(profile);
        };

        /**
         * 绘制右侧Grid Column
         */
        $scope.renderQueryResultGrid = function (profile) {
            if (profile) {
                var columnDefs = _.filter(profile['@source'], {'$checked': true});
                _.sortBy(columnDefs, ['displayOrder', 'displayName']);
                _.each(columnDefs, function (column) {
                    column.field = column.columnName;
                    column.headStyle = {width: column.displayWidth};
                    column.cellStyle = {width: column.displayWidth};
                });
                $scope.queryResultGridOptions.columnDefs = columnDefs;
            }
        };

        $scope.openQueryConditionDialog = function () {
            dialogProvider.openDialog({
                    templateUrl: 'app/log-query-analyzer/query-condition-dialog.html',
                    controllerName: 'queryConditionDialogCtrl',
                    resolves: {
                        data: {queryText: $scope.model.selectedQueryProfile.content}
                    },
                    options: {
                        title: '编辑查询条件',
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
                        $scope.model.selectedQueryProfile.content = $dialogScope.result;
                        $scope.query();
                    }
                };
            });
        };

        $scope.query = function () {
            logQueryAnalyzerService.query($scope.model.selectedQueryProfile.contentObj).then(function (rows) {
                $scope.queryResultGridApi.setGridData(rows, rows.length);
                notifyProvider.notify("查询到[" + rows.length + "]条结果。");
            });
        };


        $scope.resizeLayout = function () {
            $timeout(function () {
                var queryPanelWidth = ($(window).width() - $('.field-panel').width() - 5)
                $('.query-panel').width(queryPanelWidth);

                $scope.columnGridApi.resizeGridLayout(null, $(window).height() - 75);
                $scope.queryResultGridApi.resizeGridLayout($('.query-result-panel').width(), $(window).height() - 115);
            }, 500);
        };

        $scope.onLoad();
    }]);
