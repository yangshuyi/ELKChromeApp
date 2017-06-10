'use strict';
angular.module('elkChromeApp.logQueryAnalyzerModule').controller('logQueryAnalyzerCtrl', ['$scope', '$rootScope', '$state', '$timeout', '$window', 'constants', 'commonDialogProvider', 'dialogProvider', 'notifyProvider', 'loadingMaskProvider'
    , 'esDaoUtils', 'logQueryAnalyzerService'
    , function ($scope, $rootScope, $state, $timeout, $window, constants, commonDialogProvider, dialogProvider, notifyProvider, loadingMaskProvider
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

        /**
         * 重新加载查询方案
         */
        $scope.reloadUserProfiles = function () {
            logQueryAnalyzerService.loadQueryProfiles().then(function (profiles) {
                $scope.model.queryProfiles = profiles;

                if ($scope.model.selectedQueryProfile == null) {
                    return;
                }

                var selectedProfile = _.find($scope.model.queryProfiles, {name: $scope.model.selectedQueryProfile.name});
                $scope.model.selectedQueryProfile = selectedProfile;
                $scope.onQueryProfileSelected($scope.model.selectedQueryProfile);
            });
        };

        $scope.onColumnChanged = function () {
            if ($scope.model.selectedQueryProfile == null) {
                return;
            }

            var profile = $scope.model.selectedQueryProfile;
            var oldSource = profile.content['@sources'];

            profile.content['@sources'] = [];
            _.each($scope.columns, function (column) {
                if (column.$checked) {
                    var oldSourceItem = _.find(oldSource, {columnName: column.columnName});
                    if (oldSourceItem) {
                        //如果已存在，则直接获取
                        profile.content['@sources'].push(oldSourceItem);
                    } else {
                        //如果不存在，则用column上的默认值
                        profile.content['@sources'].push({
                            columnName: column.columnName,
                            displayName: column.displayName,
                            displayOrder: profile.content['@sources'].length + 1,
                            displayWidth: column.defaultSetting.displayWidth
                        });
                    }
                }
            });
            $scope.renderQueryResultGrid(profile);
        };

        $scope.onQueryProfileSelected = function (profile) {
            $timeout(function(){
                if (profile == null) {
                    return;
                }

                //重设左边的显示列
                if (profile.content['@sources'] && profile.content['@sources'].length > 0) {
                    //如果有source定义，则反刷左侧列表
                    var source = profile.content['@sources'];
                    _.each($scope.columns, function (column) {
                        var sourceItem = _.find(source, {columnName: column.columnName});
                        if (sourceItem) {
                            column.$checked = true;
                            sourceItem.displayName = column.displayName;
                        } else {
                            column.$checked = false;
                        }
                    })
                } else {
                    //如果无source定义，则由左侧列表刷profile
                    profile.content['@sources'] = [];
                    _.each($scope.columns, function (column) {
                        column.$checked = column.defaultSetting.$checked;
                        if (column.defaultSetting.$checked) {
                            profile.content['@sources'].push({
                                columnName: column.columnName,
                                displayName: column.displayName,
                                displayOrder: column.defaultSetting.displayOrder,
                                displayWidth: column.defaultSetting.displayWidth
                            });
                        }
                    });
                }

                $scope.queryResultGridApi.setGridData([], 0);
                $scope.renderQueryResultGrid(profile);
                $scope.query();
            });
        };

        /**
         * 绘制右侧Grid Column
         */
        $scope.renderQueryResultGrid = function (profile) {
            if (profile) {
                profile.content['@sources'] = _.sortBy(profile.content['@sources'], ['displayOrder', 'displayName']);
                _.each(profile.content['@sources'], function (sourceItem, idx) {
                    sourceItem.field = sourceItem.columnName;
                    sourceItem.displayOrder = idx;
                    sourceItem.headStyle = {width: sourceItem.displayWidth};
                    sourceItem.cellStyle = {width: sourceItem.displayWidth};
                });
                $scope.queryResultGridOptions.columnDefs = profile.content['@sources'];
            }
        };

        $scope.openQueryConditionDialog = function () {
            dialogProvider.openDialog({
                    templateUrl: 'app/log-query-analyzer/query-condition-dialog.html',
                    controllerName: 'queryConditionDialogCtrl',
                    resolves: {
                        queryProfile: $scope.model.selectedQueryProfile
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
            loadingMaskProvider.start('查询中。。。');
            logQueryAnalyzerService.query($scope.model.selectedQueryProfile.content).then(function (rows) {
                $scope.queryResultGridApi.setGridData(rows, rows.length);
                notifyProvider.notify("查询到[" + rows.length + "]条结果。");

                loadingMaskProvider.complete();
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
