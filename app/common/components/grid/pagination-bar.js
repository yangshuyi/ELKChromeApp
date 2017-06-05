angular.module('common.components.grid').directive('paginationBar', function () {

    return {
        restrict: 'E',
        link: function link($scope, el, attrs) {
            $scope.onLoad = function () {
                $scope.$watch('options.totalRecordCount', function () {
                    console.log('totalRecordCount changed');
                    //总记录数变动，需要重新分页
                    $scope.options.currentPage = 1;
                    $scope.options.currentGroup = 1;
                    $scope.pageChange(false);
                }, true);

                $scope.$watch('options.pageItemSize', function () {
                    console.log('pageItemSize changed');
                    //每页显示记录数变动，需要重新分页
                    $scope.options.currentPage = 1;
                    $scope.options.currentGroup = 1;
                    $scope.pageChange(true);
                }, true);
            };
            $scope.options.resetPage = function () {
                $scope.options.currentPage = 1;
                $scope.options.currentGroup = 1;
                $scope.pageChange(false);
            };
            /**
             * 页面切换，计算分组情况
             */
            $scope.pageChange = function (needNotifyPageChanged) {
                $scope.options.totalRecordCount = $scope.options.totalRecordCount || 0;

                //最大页数
                $scope.maxPageNum = parseInt(($scope.options.totalRecordCount - 1) / $scope.options.pageItemSize + 1);
                //最大组数
                $scope.maxGroupNum = parseInt(($scope.maxPageNum - 1) / $scope.options.groupItemSize + 1);
                //当前组
                $scope.options.currentGroup = parseInt(($scope.options.currentPage - 1) / $scope.options.groupItemSize + 1);
                //当前组所在的第一页
                $scope.firstPageInCurrentGroup = ($scope.options.currentGroup - 1) * $scope.options.groupItemSize + 1;
                //当前组所在的最后一页
                $scope.lastPageInCurrentGroup = ($scope.options.currentGroup) * $scope.options.groupItemSize;
                $scope.lastPageInCurrentGroup = $scope.lastPageInCurrentGroup > $scope.maxPageNum ? $scope.maxPageNum : $scope.lastPageInCurrentGroup;

                $scope.pageArray = [];
                for (var page = $scope.firstPageInCurrentGroup; page <= $scope.lastPageInCurrentGroup; page++) {
                    $scope.pageArray.push(page);
                }

                if (needNotifyPageChanged && $scope.onPaginationChange) {
                    $scope.onPaginationChange($scope.options.currentPage, $scope.options.pageItemSize);
                }
                $scope.allRowCheckedFlag = false;
            };

            /***
             *  页面调整动作触发
             */
            $scope.gotoPage = function (page) {
                if (page <= 0) {
                    page = 1;
                }
                if (page > $scope.maxPageNum) {
                    page = $scope.maxPageNum;
                }
                $scope.options.currentPage = page;

                $scope.pageChange(true);
            };

            $scope.onLoad();
        },
        templateUrl: 'app/common/components/grid/pagination-bar.tpl.html'
    };
})