'use strict';
angular.module('common.components.dialog').directive("dialog", ['$compile', '$timeout', function ($compile, $timeout) {
    var template = '' +
        '<div ng-show="options.isVisible" ng-style="{width: options.width, height: options.height, \'font-size\': options.fontSize}" ng-class="[\'dialog\', options.dialogCls]">' +
        '   <div ng-if="options.hasHead" ng-mousedown="headMouseDown($event)" ng-class="[\'head\', options.headCls]" style="">' +
        '       <div style="flex:1">{{options.title}}</div>' +
        '       <div ng-if="options.collapsible" ng-click="toggle()" ng-class="{true:\'head-btn glyphicon glyphicon-triangle-top\',false:\'head-btn glyphicon glyphicon-triangle-bottom\'}[options.collapsed]" style="cursor: pointer;"/>' +
        '       <div ng-if="options.closable" title="{{options.closeText}}" ng-click="close()" class="head-btn icon close-icon" style="cursor: pointer;"/>' +
        '   </div>' +
        '   <div ng-if="!options.hasHead" class="no-head">' +
        '       <span ng-if="options.closable" title="{{options.closeText}}" ng-click="close()" class="glyphicon glyphicon-remove" style="cursor: pointer;z-index: 9000;"/>' +
        '   </div>' +
        '   <div ng-class="[\'body\', options.bodyCls]" style="overflow: auto;" ng-show="!options.collapsed">' +
        '       <div ng-transclude>/' +
        '   </div>' +
        '</div>';

    return {
        restrict: 'EA',
        scope: {
            options: '=',
            api: '='

        },
        replace: true,
        transclude: true,
        link: function ($scope, $element, attrs) {
            $scope.onLoad =function(){
                //Options
                if (!attrs.popupPanelId) {
                    attrs.$set('dialogId', 'dialog_' + (new Date()).getTime());
                }
                $scope.options.title = $scope.options.title || '';
                $scope.options.isVisible = $scope.options.isVisible!=null?$scope.options.isVisible:true;
                $scope.options.hasHead = $scope.options.hasHead!=null?$scope.options.hasHead:true;
                $scope.options.autoHide = $scope.options.autoHide!=null?$scope.options.autoHide:true;
                $scope.options.collapsible = $scope.options.collapsible!=null?$scope.options.collapsible:false;
                $scope.options.collapsed = $scope.options.collapsed!=null?$scope.options.collapsed:false;
                $scope.options.closable = $scope.options.closable!=null?$scope.options.closable:true;
                //$scope.options.destroyOnClose = $scope.options.destroyOnClose || true;
                $scope.options.closeText = $scope.options.closeText || '关闭';
                $scope.options.enableDrag = $scope.options.enableDrag!=null?$scope.options.enableDrag:true;
                $scope.options.modal = $scope.options.modal!=null?$scope.options.modal:true;
                //Class
                $scope.options.dialogCls = $scope.options.dialogCls || '';
                $scope.options.headCls = $scope.options.headCls || '';
                $scope.options.bodyCls = $scope.options.bodyCls || '';
                $scope.options.bodyStyle = $scope.options.bodyStyle || '';
                $scope.options.height = $scope.options.height || '300px';
                $scope.options.width = $scope.options.width || '400px';

                $scope.initData();
            };


            $scope.initData = function () {
                // init explore api
                $scope.apiWatcher = $scope.$watch('api', function (newVal, oldVal) {
                    if ($scope.api) {
                        $scope.api.open = $scope.open;
                        $scope.api.isOpened = $scope.isOpened;
                        $scope.api.setCloseFlag = $scope.setCloseFlag;
                        $scope.api.close = $scope.close;
                        $scope.api.setToTopLayer = $scope.setToTopLayer;
                        $scope.api.setToCenter = $scope.setToCenter;
                        $scope.api.element = $element;
                    }
                });

                $scope.collapseWatcher = $scope.$watch('options.collapsed', function (newValue, oldValue) {
                    if ($scope.options.collapsed) {
                        $element.css('height', 'auto');
                    } else {
                        $element.css('height', $scope.options.height);
                    }
                });

                $scope.maskElement = null;
                $scope.diviation = {x: 0, y: 0};
                $scope.mouseMoveHandler = null;
                $scope.mouseUpHandler = null;

                $timeout(function () {
                    $scope.headEle = $('.head', $element);

                    $scope.open();
                    $scope.setToTopLayer();
                    $scope.setToCenter();
                });
            };

            //public method
            $scope.headMouseDown = function ($event) {
                $scope.setToTopLayer();

                if ($scope.options.enableDrag) {
                    $scope.headMouseUp();

                    $scope.dragging = true;


                    //设置捕获范围
                    if ($scope.headEle.setCapture) {
                        $scope.headEle.setCapture();
                    }

                    //使用pageX-offsetLeft计算鼠标和对话框左上角的偏差值
                    $scope.diviation.x = $event.pageX - $element.offset().left;
                    $scope.diviation.y = $event.pageY - $element.offset().top;

                    $scope.mouseMoveHandler = $(window).bind('mousemove', function ($event) {
                        $scope.headMouseMove($event);
                    });

                    $scope.mouseUpHandler = $(window).bind('mouseup', function ($event) {
                        $scope.headMouseUp($event);
                    });
                }
            };

            $scope.headMouseMove = function ($event) {
                if ($scope.options.enableDrag) {
                    if (!$scope.dragging) {
                        return;
                    }
                    //使用fixed的position,所以用clientX而不是pageX
                    $element.css('left', $event.clientX - $scope.diviation.x + 'px');
                    $element.css('top', $event.clientY - $scope.diviation.y + 'px');
                }
            };

            $scope.headMouseUp = function () {
                if ($scope.options.enableDrag) {
                    $scope.dragging = false;

                    if ($scope.mouseMoveHandler != null) {
                        $(window).unbind('mousemove', $scope.mouseMoveHandler);
                        $scope.mouseMoveHandler = null;
                    }
                    if ($scope.mouseUpHandler != null) {
                        $(window).unbind('mouseup', $scope.mouseUpHandler);
                        $scope.mouseUpHandler = null;
                    }

                    //取消捕获范围
                    if ($scope.headEle.releaseCapture) {
                        $scope.headEle.releaseCapture();
                    }
                }
            };

            $scope.toggle = function () {
                if ($scope.options.collapsed) {
                    $scope.expand();
                } else {
                    $scope.collapse();
                }
            };

            $scope.expand = function () {
                $scope.options.collapsed = false;
            };

            $scope.collapse = function () {
                $scope.options.collapsed = true;
            };



            $scope.open = function () {
                $element.css({'left': '0px', 'top': '0px'});
                $scope.options.isVisible = true;

                if ($scope.options.modal == true) {
                    if ($scope.maskElement == null) {
                        var maskElement = '<div class="dialog-mask"></div>';
                        $scope.maskElement = $(maskElement);
                    }
                    var width = $(document).outerWidth() > $(window).width() ? $(document).outerWidth() : '100%';
                    var height = $(document).outerHeight() > $(window).height() ? $(document).outerHeight() : $(window).height();
                    $scope.maskElement.width(width);
                    $scope.maskElement.height(height);

                    $('body').append($scope.maskElement);
                }

                if ($scope.options.autoHide == true) {
                    // register closeFun
                    $timeout(function () {
                        $(document).one("click", $scope.closeFun);
                    }, 500);
                }
            };
            //define closeFun bind to .dialog
            $scope.closeFun = function (e) {
                var clickInside = $(e.target).closest('.dialog');
                if (clickInside.length <= 0) {
                    $scope.close();
                } else {
                    $(document).one("click", $scope.closeFun);
                }
            };
            $scope.isOpened = function () {
                return $scope.options.isVisible;
            };

            $scope.setCloseFlag = function (flag) {
                $scope.$parent.canNotClose = flag;
            };

            $scope.close = function () {
                //关闭对话框前检查
                if ($scope.$parent && $scope.$parent.canNotClose) {
                    //for parentWindow
                    $(document).one("click", $scope.closeFun);
                    return;
                }

                if ($scope.$parent && $scope.$parent.beforeDialogClose) {
                    var result = $scope.$parent.beforeDialogClose();
                    if (result != true) {
                        return;
                    }
                }

                $scope.options.isVisible = false;

                if ($scope.options.modal == true && $scope.maskElement != null) {
                    $scope.maskElement.remove();
                    $scope.maskElement = null;
                }
                $element.remove();

                //取消watch
                if ($scope.apiWatcher) {
                    $scope.apiWatcher();
                }

                if ($scope.collapseWatcher) {
                    $scope.collapseWatcher();
                }

                if ($scope.$parent && $scope.$parent.onDialogClose) {
                    $scope.$parent.onDialogClose();
                }
            };

            $scope.setToTopLayer = function () {
                var dialogElements = $('.dialog');
                if (dialogElements === 0) {
                    return;
                }

                dialogElements.removeClass('active');
                $element.addClass('active');

                var maxZIndexElement = _.max(dialogElements, function (divElement) {
                    var zIndex = parseInt(divElement.style.zIndex);
                    return isNaN(zIndex) ? 0 : zIndex;
                });

                var zIndex = parseInt(maxZIndexElement.style.zIndex);
                zIndex = (isNaN(zIndex) ? 0 : zIndex);

                if (zIndex == 0 || $(maxZIndexElement).attr('dialog-id') != $element.attr('dialog-id')) {
                    if(zIndex == 0){
                        zIndex = 9999;
                    }
                    $element.css('z-index', zIndex + 1);

                    if ($scope.options.modal == true) {
                        if ($scope.maskElement != null) {
                            $scope.maskElement.css('z-index', zIndex);
                        }
                    }
                }

            };

            $scope.setToCenter = function (paramScrollTop) {
                // self redefine scrollTop
                var windowWidth = $(window).width();
                var windowHeight = $(window).height();
                var dialogWidth = $element.width();
                var dialogHeight = $element.height();
                var left = (windowWidth - dialogWidth) / 2;
                var top = (windowHeight - dialogHeight) / 2;
                $element.css({'left': left + 'px', 'top': top + 'px'});
            };

            $scope.onLoad();
        },
        template: template
    };
}]);