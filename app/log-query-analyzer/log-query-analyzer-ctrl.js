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
                $scope.onColumnChanged();

            });

            logQueryAnalyzerService.loadQueryProfiles().then(function (profiles) {
                $scope.model.queryProfiles = profiles;
            });

            $scope.resizeLayout();
        };

        $scope.onColumnChanged = function () {
            var selectedColumns = $scope.columnGridApi.getCheckedRows();

            var columnDefs = [];
            _.each(selectedColumns, function (column) {
                var columnDef = {
                    field: column.columnName,
                    displayName: column.caption,
                    enableSorting: false,
                    headStyle: {width: '100px'},
                    cellStyle: {width: '100px'},
                };
                columnDefs.push(columnDef);
            });
            $scope.queryResultGridOptions.columnDefs = columnDefs;

            if (profile['@source'] && _.isArray(profile['@source'])) {
                _.each(profile['@source'], function (source) {
                    var column = _.find($scope.columns, {columnName: source});
                    if (column) {
                        column.$checked = true;
                    }
                });
            } else {
                //尚未设置显示的列
                _.each($scope.columns, function (column) {
                    if (column.defaultChecked) {
                        profile.contentObj['@source'] = _.map($scope.columns, 'columnName');
                        column.$checked = true;
                    }
                });
                profile.content = JSON.stringify(profile.contentObj);
            }
        };

        $scope.onQueryProfileSelected = function () {
            var profile = $scope.model.selectedQueryProfile;
            if (profile == null) {
                return;
            }

            $scope.columnGridApi.checkAllRows(false, true);

            if (profile['@source'] && _.isArray(profile['@source'])) {
                _.each(profile['@source'], function (source) {
                    var column = _.find($scope.columns, {columnName: source});
                    if (column) {
                        column.$checked = true;
                    }
                });
            } else {
                //尚未设置显示的列
                _.each($scope.columns, function (column) {
                    if (column.defaultChecked) {
                        profile.contentObj['@source'] = _.map($scope.columns, 'columnName');
                        column.$checked = true;
                    }
                });
                profile.content = JSON.stringify(profile.contentObj);
            }

            $scope.queryResultGridOptions.columnDefs = columnDefs;
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
