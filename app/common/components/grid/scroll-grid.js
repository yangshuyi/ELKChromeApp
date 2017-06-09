/**
 * Options属性：
 *      gridHighlightCellStyleFlag：是否显示行高选样式
 *      rowSelectable：行是否可选
 *      rowCheckable：行是否可以check
 *      multiRowCheckable：是否支持多行的check
 *
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
 *      $selected
 *
 * API：
 *      setGridData
 */

angular.module('common.components.grid').directive('scrollGrid', ['$timeout', '$window', '$q', function ($timeout, $window, $q) {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            options: '=',
            onRowSelected: '=',
            onRowDbClicked: '=',
            api: '='
        },
        link: function ($scope, $element, $attrs) {
            $scope.onLoad = function () {
                $scope.options.rowSelectable = $scope.options.rowSelectable || false;
                $scope.appScope = $scope.$parent;

                // init explore api
                $scope.$watch('api', function (newVal, oldVal) {
                    if ($scope.api) {
                        $scope.api.reload = $scope.reload;
                        $scope.api.setGridData = $scope.setGridData;
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
            $scope.reload = function () {
                $scope.onLoad();
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

                var deferred = $q.defer();
                $timeout(function () {

                    //注册事件
                    var headDiv = $('.head-container', $element);
                    var contentDiv = $('.content-container', $element);
                    contentDiv.scroll(function () {
                        headDiv.scrollLeft(contentDiv.scrollLeft());
                    });

                    $('th', headDiv).mouseover(function ($event) {
                        var th = $event.currentTarget;
                        if (th) {
                            var helperLayer = $('.helper-layer', $element);
                            $scope.currentThElem = th;
                            var offset = $($event.currentTarget).offset();
                            var headDivOffset = headDiv.offset();
                            helperLayer.css('left', (offset.left - headDivOffset.left + 15 + $(th).outerWidth(true) - helperLayer.outerWidth(true)) + 'px');
                            helperLayer.css('top', (offset.top - headDivOffset.top + headDiv.outerHeight(true) - helperLayer.outerHeight(true)) + 'px');
                            helperLayer.show();
                        }
                    });

                    deferred.resolve();
                }, 500);
                return deferred.promise;
            };

            $scope.setGridData = function (gridData, totalRecordCount) {
                $scope.gridData = gridData;
                $scope.options.totalRecordCount = totalRecordCount;

                $scope.unSelectedAllRows();
            };

            $scope.resizeGridLayout = function (gridWidth, gridHeight) {
                var headDiv = $('.head-container', $element);
                var contentDiv = $('.content-container', $element);

                var boundHeight = headDiv.outerHeight(true);

                headDiv.width(gridWidth);
                contentDiv.width(gridWidth);
                contentDiv.height(gridHeight - boundHeight);
            };

            $scope.getCurrentColumn = function () {
                var column = null;
                if ($scope.currentThElem) {
                    var fieldName = $($scope.currentThElem).attr('field');
                    column = _.find($scope.columns, {field: fieldName});
                }
                return column;
            };

            $scope.addTdWidth = function () {
                var column = $scope.getCurrentColumn();
                if (!column) {
                    return;
                }
                //hardCode
                column.displayWidth = column.displayWidth + 50;
                column.headStyle.width = column.displayWidth + "px";
                column.cellStyle.width = column.displayWidth + "px";
            };

            $scope.minusTdWidth = function () {
                var column = $scope.getCurrentColumn();
                if (!column) {
                    return;
                }
                if (column.displayWidth > 100) {
                    column.displayWidth = column.displayWidth - 50;
                    column.headStyle.width = column.displayWidth + "px";
                    column.cellStyle.width = column.displayWidth + "px";
                }
            };

            $scope.moveTdFwd = function () {
                var column = $scope.getCurrentColumn();
                if (!column) {
                    return;
                }
                var idx = $scope.columns.indexOf(column);
                if (idx > 0) {
                    $scope.columns[idx] = $scope.columns[idx - 1];
                    $scope.columns[idx - 1] = column;

                    //hardCode
                    $scope.columns[idx].displayOrder = idx;
                    $scope.columns[idx - 1].displayOrder = idx - 1;
                }
                $('.helper-layer', $element).hide();
            };

            $scope.moveTdBwd = function () {
                var column = $scope.getCurrentColumn();
                if (!column) {
                    return;
                }
                var idx = $scope.columns.indexOf(column);
                if (idx < $scope.columns.length - 1) {
                    $scope.columns[idx] = $scope.columns[idx + 1];
                    $scope.columns[idx + 1] = column;
                    //hardCode
                    $scope.columns[idx].displayOrder = idx;
                    $scope.columns[idx + 1].displayOrder = idx + 1;
                }
                $('.helper-layer', $element).hide();
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

            $scope.onLoad();
        },
        templateUrl: "app/common/components/grid/scroll-grid.tpl.html"
    }
}])