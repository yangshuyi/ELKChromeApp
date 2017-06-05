angular.module('common.components.panel').directive('panel', ['$timeout', function ($timeout) {
    return {
        scope: {
            collapsible: '@',
            collapsed: '@',
            withHeading: '@',
            headingCaption: '@',
            withFooter: '@',
            panelClass: '@',
            onCollapseStatusChanged: '=',
        },
        restrict: 'E',
        transclude: true,
        link: function ($scope, elem, attrs) {
            $scope.onLoad = function () {
            };

            $scope.onPanelHeadingDblClicked = function () {
                if ($scope.collapsible == 'true') {
                    $scope.changePanelCollapseStatus();
                }
            };

            $scope.changePanelCollapseStatus = function () {
                if ($scope.collapsed) {
                    $scope.collapsed = false;
                } else {
                    $scope.collapsed = true;
                }

                if ($scope.onCollapseStatusChanged) {
                    $scope.onCollapseStatusChanged($scope.collapsed);
                }
            };

            $scope.onLoad();
        },
        template: '' +
        '<div class="panel panel-primary {{panelClass}}">' +
        '   <div ng-if="withHeading" class="panel-heading" ng-dblclick="onPanelHeadingDblClicked()">' +
        '       <div class="caption">{{ headingCaption }}</div>' +
        '       <div class="action-bar">' +
        '           <i ng-if="collapsible!=\'false\'" ng-click="changePanelCollapseStatus()" ng-class="{\'glyphicon glyphicon-chevron-down\': !collapsed , \'glyphicon glyphicon-chevron-right\': collapsed}"></i>' +
        '       </div>' +
        '   </div>' +
        '   <div ng-hide="collapsed" class="panel-body" ng-show="initStatus" ng-transclude>' +
        '   </div>' +
        '   <div ng-if="withFooter"  class="panel-footer">' +
        '   </div>' +
        '</div>' +
        '</div>'
    }
}]);