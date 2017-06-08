/**
 * Options属性：
 *      gridHighlightCellStyleFlag：是否显示行高选样式
 *      rowSelectable：行是否可选
 *      rowCheckable：行是否可以check
 *      multiRowCheckable：是否支持多行的check
 *      paginationSupport：是否使用分页
 *      useExternalPagination：是否使用外部分页
 *      fixedHeightFlag：是否固定高度
 *
 *      noDataMessage
 *
 *      currentPage: 当前页
 *      currentGroup：当前页所属分组
 *      pageItemSize：每页显示数据数量
 *      groupItemSize：每组显示的页数;
 * Grid Col属性：
 *      field：字段
 *      displayName：显示列头名称
 *      sort：排序状态 - null，'asc'，'desc'
 *      enableSorting：是否支持排序
 *      hidden：是否隐藏该列
 *
 *      headTemplate：head模板
 *      headTemplateScope：head模板scope
 *      headStyle：head样式（ng-style）
 *
 *      cellTemplate：cell模板
 *      cellTemplateScope：cell模板scope
 *      cellStyle：cell样式（ng-style）
 *
 * Grid Row属性：
 *      $checked
 *      $selected
 *      $checkable：是否可以check，由外部传入
 *
 * API：
 *      getCheckedRows
 *      checkAllRows
 *      setGridData
 */

angular.module('common.components.grid').directive('paginationGrid', ['$timeout', '$window', function ($timeout, $window) {
    var TEMPLATE_FIXED_HEIGHT = 'app/common/components/grid/fixed-height-pagination-grid.tpl.html';
    var TEMPLATE_AUTO_HEIGHT = 'app/common/components/grid/auto-height-pagination-grid.tpl.html';

    return {
        restrict: 'E',
        replace: true,
        scope: {
            options: '=',
            onRowSelected: '=',
            onRowChecked: '=',
            onAllRowChecked: '=',
            onRowDbClicked: '=',
            onPaginationChange: '=',
            onSortChanged: '=',
            api: '='
        },
        link: function ($scope, $element, $attrs) {
            $scope.onLoad = function () {
                $scope.options.gridHighlightCellStyleFlag = $scope.options.gridHighlightCellStyleFlag || true;
                $scope.options.rowSelectable = $scope.options.rowSelectable || false;
                $scope.options.rowCheckable = $scope.options.rowCheckable || false;
                $scope.options.multiRowCheckable = $scope.options.multiRowCheckable || false;
                $scope.options.useExternalPagination = $scope.options.useExternalPagination || false;
                $scope.options.noDataMessage = $scope.options.noDataMessage || '没有找到匹配的结果。';
                $scope.options.pageItemSize = $scope.options.pageItemSize || 10;
                $scope.appScope = $scope.$parent;

                $scope.options.currentPage = 1;
                $scope.options.currentGroup = 0;
                $scope.options.pageItemSize = 10;
                $scope.options.groupItemSize = 5;



                // init explore api
                $scope.$watch('api', function (newVal, oldVal) {
                    if ($scope.api) {
                        $scope.api.reload = $scope.reload;
                        $scope.api.getCheckedRows = $scope.getCheckedRows;
                        $scope.api.checkAllRows = $scope.checkAllRows;
                        $scope.api.setGridData = $scope.setGridData;
                        $scope.api.resetPage = $scope.resetPage;
                        $scope.api.resizeGridLayout = $scope.resizeGridLayout;
                    }
                });

                $scope.$watch('options.columnDefs', function (newVal, oldVal) {
                    $scope.initColumns();
                });
            };

            /**
             * 重新加载组件
             */
            $scope.reload = function(){
                $scope.onLoad();
            };

            /**
             * 重新初始化分页
             */
            $scope.resetPage = function () {
                $scope.options.resetPage();
            };

            /**
             * 初始化列
             **/
            $scope.initColumns = function () {
                $scope.columns = _.filter($scope.options.columnDefs, function (col) {
                    if (col.hidden == true) {
                        return false;
                    } else {
                        return true;
                    }
                });

                $scope.columnCount = $scope.columns.length;

                if($scope.options.gridHighlightCellStyleFlag){
                    $scope.columnCount++;
                }
                if($scope.options.rowCheckable){
                    $scope.columnCount++;
                }
            };

            $scope.setGridData = function (gridData, totalRecordCount) {
                $scope.gridData = gridData;
                if (!$scope.options.useExternalPagination) {
                    $scope.gridDataBak = angular.copy($scope.gridData); //内建排序时使用
                }
                $scope.options.totalRecordCount = totalRecordCount;
            };

            $scope.resizeGridLayout = function(gridWidth, gridHeight){
                if(!$scope.options.fixedHeightFlag){
                    return;
                }

                var headDiv = $('.head-container', $element.parent());
                var contentDiv = $('.content-container', $element.parent());
                var paginationBarDiv = $('.pagination-bar', $element.parent());

                var boundHeight = headDiv.outerHeight(true)+paginationBarDiv.outerHeight(true);
                contentDiv.height(gridHeight - boundHeight);
            };

            $scope.sortData = function (col, columns) {
                if (!col.enableSorting) {
                    return;
                }
                var sortedData = {};

                //清除之前的排序列
                _.forEach(columns, function (otherCol) {
                    if (col.field != otherCol.field) {
                        otherCol.sort = null;
                    }
                });

                if (col.sort == null) {
                    col.sort = 'desc';
                } else if (col.sort == 'desc') {
                    col.sort = 'asc';
                } else if (col.sort == 'asc') {
                    col.sort = null;
                }

                if ($scope.options.useExternalPagination) {
                    if ($scope.onSortChanged) {
                        var sortField = col.sort == null ? null : col.field;
                        $scope.onSortChanged($scope.options.currentPage, $scope.options.pageItemSize, sortField, col.sort);
                    }
                } else {
                    if (col.sort == null) {
                        sortedData = $scope.gridDataBak;
                    } else if (col.sort == 'asc') {
                        sortedData = _.sortBy($scope.gridData, col.field);
                    } else if (col.sort == 'desc') {
                        sortedData = _.sortBy($scope.gridData, col.field).reverse();
                    }
                    angular.copy(sortedData, $scope.gridData);
                }
            };

            /*** checkbox 相关逻辑 ***/
            $scope.checkAllRows = function (manualFlag, silentFlag) {
                if ($scope.options.rowCheckable && $scope.options.multiRowCheckable) {
                    if (manualFlag != null) {
                        $scope.allRowCheckedFlag = manualFlag;
                    } else {
                        $scope.allRowCheckedFlag = !!!$scope.allRowCheckedFlag;
                    }


                    _.forEach($scope.gridData, function (row) {
                        if (row.$checkable == false) {
                            return;
                        }
                        row.$checked = $scope.allRowCheckedFlag;
                        // if ($scope.onRowChecked && silentFlag!=true) {
                        //     $scope.onRowChecked(row, row.$checked);
                        // }
                    });

                    if($scope.onAllRowChecked && silentFlag!=true){
                        $scope.onAllRowChecked($scope.allRowCheckedFlag);
                    }
                }
            };

            $scope.checkRow = function (row) {
                if ($scope.options.rowCheckable && row.$checkable != false) {
                    if ($scope.options.multiRowCheckable == false) {
                        _.forEach($scope.gridData, function (rowItem) {
                            if (rowItem != row) {
                                rowItem.$selected = false;
                                if ($scope.onRowSelected) {
                                    $scope.onRowSelected(rowItem, false);
                                }
                            }
                        });
                    }
                    row.$checked = !!row.$checked;
                    if ($scope.onRowChecked) {
                        $scope.onRowChecked(row, row.$checked);
                    }

                    $scope.updateRowCheckedFlag();
                }
            };

            $scope.updateRowCheckedFlag = function () {
                //checkbox的全选和全不选的问题
                if ($scope.gridData == null || $scope.gridData.length == 0) {
                    $scope.allRowCheckedFlag = false;
                    return;
                }
                var uncheckedRow = _.find($scope.gridData, function (row) {
                    return !row.$checked && row.$checkable != false;
                });
                $scope.allRowCheckedFlag = (uncheckedRow == null);
            };

            $scope.getCheckedRows = function () {
                if ($scope.options.rowCheckable) {
                    var checkedRows = [];
                    _.forEach($scope.gridData, function (row) {
                        if (row.$checked) {
                            checkedRows.push(row);
                        }
                    });
                    return checkedRows;
                } else {
                    return [];
                }
            };


            /*** select 相关逻辑 ***/
            $scope.selectRow = function (row) {
                if ($scope.options.rowSelectable) {
                    _.forEach($scope.gridData, function (rowItem) {
                        if (rowItem != row) {
                            rowItem.$selected = false;
                            if ($scope.onRowSelected) {
                                $scope.onRowSelected(rowItem, false);
                            }
                        }
                    });
                    row.$selected = true;
                    if ($scope.onRowSelected) {
                        $scope.onRowSelected(row, true);
                    }
                }
            };

            $scope.unSelectedAllRows = function () {
                if ($scope.options.rowSelectable) {
                    _.forEach($scope.gridData, function (row) {
                        row.$selected = false;
                        if ($scope.onRowSelected) {
                            $scope.onRowSelected(row, false);
                        }
                    });
                }
            };


            /*** 模板选择相关逻辑 ***/
            $scope.getTemplate = function () {
                return $scope.options.fixedHeightFlag ? TEMPLATE_FIXED_HEIGHT : TEMPLATE_AUTO_HEIGHT;
            };

            $scope.onLoad();
        },
        template: "<div ng-include='getTemplate()'></div>"
    }
}])