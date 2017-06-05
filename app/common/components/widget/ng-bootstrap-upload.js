angular.module('common.components.widget')
    .directive('ngUpload', [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                options: '=',
                onUpload: '=',
                onDblClick: '=',
                onDelete: '=',
                ngDisabled: '@'
            },
            link: function (scope, element, attrs) {
                scope.options.displaySize = scope.options.displaySize || 10;
                scope.tdWidth = (100 / scope.options.displaySize) + "%";
                var blockWidth = (element.width() - 160) * (100 / scope.options.displaySize) / 100;
                var blockHeight = 95;

                scope.options.caption = scope.options.caption || '附件上传';
                scope.options.uploadBtnCaption = scope.options.uploadBtnCaption || '上传';
                scope.options.data = scope.options.data || [];
                scope.init = function () {
                    // When refresh the UI the gallery don't back to first stage. Keep it in current stage.
                    scope.currentGroupNum = scope.currentGroupNum || 1;
                    scope.currentGroup = [];
                    scope.groupSize = scope.groupSize || 0;
                    if (scope.options.data.length > 0) {
                        _.forEach(scope.options.data, function (item) {
                            //item._class = "img-div";
                            //item._selection = false;
                            item[scope.options.widthField] = item[scope.options.widthField] || "600";

                            //图片宽高计算
                            var imageWidth = item[scope.options.widthField];
                            var imageHeight = item[scope.options.heightField];
                            if (imageWidth > 0 && imageHeight > 0) {
                                if ((imageWidth / imageHeight) > ( blockWidth / blockHeight)) {
                                    //过宽
                                    item.imageWidthAfterCalc = blockWidth;
                                    item.imageHeightAfterCalc = imageHeight * (blockWidth / imageWidth);
                                    item.imageMarginHeightAfterCalc = ( blockHeight - item.imageHeightAfterCalc) / 2.0;
                                } else {
                                    //过高
                                    item.imageWidthAfterCalc = imageWidth * ( blockHeight / imageHeight);
                                    item.imageHeightAfterCalc = blockHeight;
                                    item.imageMarginHeightAfterCalc = 0;
                                }
                            }
                            else {
                                item.imageWidthAfterCalc = blockWidth;
                                item.imageHeightAfterCalc = blockHeight;
                                item.imageMarginHeightAfterCalc = 0;
                            }

                        });
                        // separate group
                        var loopId = 0, groupId = 1;
                        scope.groups = _.groupBy(scope.options.data, function (n) {
                            if (loopId < scope.options.displaySize) {
                                loopId++;
                            } else {
                                loopId = 1;
                                groupId++;
                            }
                            return groupId;
                        });
                        scope.currentGroup = scope.groups[scope.currentGroupNum];
                        if (angular.isUndefined(scope.currentGroup)) {
                            scope.prev();
                        }
                        scope.groupSize = _.size(scope.groups);
                    }
                    genEmptyData(scope.currentGroup.length);
                };
                scope.prev = function () {
                    if (scope.currentGroupNum > 1) {
                        scope.currentGroupNum = scope.currentGroupNum - 1;
                        scope.currentGroup = scope.groups[scope.currentGroupNum];
                    }
                    genEmptyData(scope.currentGroup.length);
                };
                scope.next = function () {
                    if (scope.currentGroupNum < scope.groupSize) {
                        scope.currentGroupNum = scope.currentGroupNum + 1;
                        scope.currentGroup = scope.groups[scope.currentGroupNum];
                    }
                    genEmptyData(scope.currentGroup.length);
                };
                var genEmptyData = function (existedSize) {
                    var emptyDataNum = scope.options.displaySize - existedSize;
                    if (emptyDataNum > 0) {
                        scope.emptyData = _.range(emptyDataNum);
                    } else {
                        scope.emptyData = [];
                    }
                };

                scope.hideFancyImg = function () {
                    scope.selectedItem = {};
                    angular.element("#gallery-bg").css("display", "none");
                    angular.element("#gallery-show").css("display", "none");
                };
                scope.getSelectedFiles = function () {
                    return _.filter(scope.options.data, {"_selection": true});
                };
                /**
                 * 判断是否非法格式
                 * @param file
                 * @returns {boolean}
                 */
                var checkFileType = function (file) {
                    var extensions = ".jpg,.jpeg,.bmp,.png".split(",");
                    var ary = file.name.split(".");
                    var fileExt = "." + ary[ary.length - 1].toLowerCase();

                    return extensions.some(function (extension) {
                        return fileExt == extension;
                    });
                };

                // upload function
                scope.upload = function (files) {
                    _.each(files, function (file) {
                        if (!checkFileType(file)) {
                            file.status = "1";
                            file.loadProcess = "上传失败，图片格式仅支持jpg,jpeg,png,bmp";
                        }
                        if (file.size / 1024 / 1024 > 5) {
                            file.status = "2";
                            file.loadProcess = "上传失败，单个图片容量不能超过5MB";
                        }
                    })
                    if (scope.onUpload && !_.isEmpty(files)) {
                        scope.onUpload(files);
                    }
                };
                // delete function
                scope.delete = function (item) {
                    if (scope.onDelete) {
                        scope.onDelete(item);
                    }
                };
                if (scope.options.onRegisterApi) {
                    scope.options.onRegisterApi({
                        getSelectedRows: function () {
                            return [];
                        },
                        refresh: function () {
                            scope.init();
                        }
                    });
                }

                scope.init();
            },
            template: '<div class="bootstrap-upload-gallery bootstrap-upload">\
                        <label>{{options.caption}}</label>\
                        <button ng-if="ngDisabled != \'true\'" class="btn btn-default upload-act-btn" type="button" ngf-select ngf-change="upload($files)" ngf-multiple="true" style="width:42px;height:37px;padding-left: 7px;">\
                           <div class="ng-bs-upload-button"></div>\
                        </button>\
                        <table class="image-gallery">\
                           <tr>\
                               <td class="nav-td"><span ng-class="currentGroupNum > 1 ? \'prev\' : \'prev-disable\'" ng-click="prev()"></span></td>\
                               <td width="{{tdWidth}}" ng-repeat="item in currentGroup track by $id(item)">\
                                   <div>\
                                       <div ng-class="item._selection ? \'img-div-selected\' : \'img-div\'" style="position: relative;text-align: center;height:100px" ng-mouseenter=\"showDelete=true\" ng-mouseleave="showDelete=false" ng-dblclick="onDblClick(item, options.data)">\
                                           <img ng-src="{{item[options.imageUrlField]}}" style="position: relative;width:{{item.imageWidthAfterCalc}}px;height:{{item.imageHeightAfterCalc}}px;margin-top:{{item.imageMarginHeightAfterCalc}}px;" >\
                                           <div ng-click="delete(item)" class="deleteIco" ng-show=\"showDelete && ngDisabled != \'true\' \"></div>\
                                       </div>\
                                       <div class="image-name" title="{{ item[options.imageNameField] }}">{{ item[options.imageNameField] }}</div>\
                                   </div>\
                               </td>\
                               <td width="{{tdWidth}}" ng-repeat="ed in emptyData track by $id(ed)"></td>\
                               <td class="nav-td"><span ng-class="(currentGroupNum < groupSize) ? \'next\' : \'next-disable\'" ng-click="next()"></span></td>\
                           </tr>\
                        </table>\
                        <div id="gallery-bg" ng-click="hideFancyImg()"></div>\
                    </div>'
        }
    }]);