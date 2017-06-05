'use strict';
angular.module('common.components.notify').directive("notify", ['$compile', '$timeout', function ($compile, $timeout) {
    var template = '' +
        '<div class="notify">' +
        '   <div ng-if="closable==\'true\'" ng-click="close()" class="icon close-icon" style="cursor: pointer;z-index: 9000;"/>' +
        '   <div class="content">{{content}}</div>' +
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
                $element.css({'left': '0px', 'top': '0px'});


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
            };


            $scope.setToCenter = function (paramScrollTop) {
                // self redefine scrollTop
                var windowWidth = $(window).width();
                var windowHeight = $(window).height();
                var dialogWidth = $element.width();
                var dialogHeight = $element.height();
                var scrollTop = angular.isUndefined(paramScrollTop) ? $(document).scrollTop() : paramScrollTop;
                var left = (windowWidth - dialogWidth) / 2 + $(document).scrollLeft();
                var top = (windowHeight - dialogHeight) / 2 + scrollTop;
                $element.css({'left': left + 'px', 'top': top + 'px'});
                $timeout(function () {
                    window.scrollTo(0, scrollTop);
                });
            };



            $scope.initData = function () {


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

                    var headEle = $('.head', $element);
                    headEle.css({'cursor': 'move'});
                    //设置捕获范围
                    if (headEle.setCapture) {
                        headEle.setCapture();
                    }

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

                    var headEle = $('.head', $element);
                    headEle.css({'cursor': 'move'});

                    $element.css('left', $event.pageX - $scope.diviation.x + 'px');
                    $element.css('top', $event.pageY - $scope.diviation.y + 'px');
                }
            };

            $scope.headMouseUp = function () {
                if ($scope.options.enableDrag) {
                    $scope.dragging = false;

                    var headEle = $('.head', $element);
                    headEle.css({'cursor': 'auto'});

                    if ($scope.mouseMoveHandler != null) {
                        $(window).unbind('mousemove', $scope.mouseMoveHandler);
                        $scope.mouseMoveHandler = null;
                    }
                    if ($scope.mouseUpHandler != null) {
                        $(window).unbind('mouseup', $scope.mouseUpHandler);
                        $scope.mouseUpHandler = null;
                    }

                    //取消捕获范围
                    if (headEle.releaseCapture) {
                        headEle.releaseCapture();
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
                zIndex = (isNaN(zIndex) ? 0 : zIndex)
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

            $scope.onLoad();
        },
        template: template
    };
}]);