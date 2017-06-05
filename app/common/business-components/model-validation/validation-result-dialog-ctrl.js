angular.module('model-validation').controller('validationResultDialogCtrl', ['$scope', '$timeout', '$q', '$dialogInstance', 'constants', '$parentScope','$interval',
    function ($scope, $timeout, $q, $dialogInstance, constants, $parentScope, $interval) {
        $scope.init = function () {
        };
        
        $scope.setAllowSubmitFlag = function(allowSubmitFlag, submitFunc){
            $scope.allowSubmitFlag = allowSubmitFlag;
            $scope.submitFunc = submitFunc;
        };

        $scope.setValidationResult =  function(isMultiValidationTypeFlag, validationType, result, allowSubmit, submitFunc){
            $scope.isMultiValidationTypeFlag = isMultiValidationTypeFlag;
            $scope.validationErrorResultMap = $scope.validationErrorResultMap || {};

            var currentValidationTypeResult = $scope.validationErrorResultMap[validationType.key];
            if($scope.validationErrorResultMap[validationType.key]){
                currentValidationTypeResult = $scope.validationErrorResultMap[validationType.key];
            }else{
                currentValidationTypeResult = {title: '', errorNum:0, warningNum:0, errors: {}, warnings: {}};
                $scope.validationErrorResultMap[validationType.key] = currentValidationTypeResult;
            }

            currentValidationTypeResult.key = validationType.key;
            currentValidationTypeResult.title=validationType.text;
            currentValidationTypeResult.errorNum = result.getValidationItemCount(validationType.key, 'errors');
            currentValidationTypeResult.warningNum = result.getValidationItemCount(validationType.key, 'warnings');
            currentValidationTypeResult.submitFunc = submitFunc;
            currentValidationTypeResult.showDividingLineFlag = currentValidationTypeResult.errorNum && currentValidationTypeResult.warningNum;
            currentValidationTypeResult.errors = {};
            currentValidationTypeResult.warnings = {};

            var tabHeadingMap = {};
            if($parentScope && $parentScope.tabs){
                _.each($parentScope.tabs, function(obj){
                    tabHeadingMap[obj.templateUrl] = obj.heading;
                })
            }

            _.each(result.validatorResultMap[validationType.key], function (validator) {
                //过滤和本validationType无无关的validator
                var included = _.find(validator.nodes, function(validateNode){
                    return _.startsWith(validateNode, validationType.key);
                });
                if(!included){
                    return;
                }

                //构建对话框内容
                var heading = tabHeadingMap[validator.tabName]==null?validator.tabName:tabHeadingMap[validator.tabName];
                currentValidationTypeResult[validator.errorType][heading] = currentValidationTypeResult[validator.errorType][heading] || [];
                currentValidationTypeResult[validator.errorType][heading].push(validator);
            });

            $timeout(function () {
                var $alt = $('#msg-id-' + currentValidationTypeResult.key);
                if ($alt.length > 0) {
                    $alt[0].scrollIntoView(true);
                }
            });
        };

        $scope.clickSubmitBtn = function () {
            $dialogInstance.dialogResult = true;
            var $elem = $dialogInstance.element;
            if ($elem) {
                $elem.dialog('close');
            }

            if($scope.allowSubmitFlag && $scope.submitFunc){
                $scope.submitFunc();
            }
        };

        $scope.locateValidator = function (validator) {
            if (!validator) {
                return;
            }
            var deferred = $q.defer();
            if (validator.tabName && $parentScope.enterTab) {
                $parentScope.enterTab(validator.tabName).then(function () {
                    deferred.resolve(true);
                });
            } else {
                deferred.resolve(true);
            }
            deferred.promise.then(function () {
                $scope.notice(validator.control);
            });
        };

        $scope.notice = function ($elem) {
            if (!$elem) {
                return;
            }

            var $row;
            // check in grid
            var inGrid = $elem.attr('in-grid');
            if (!angular.isUndefined(inGrid)) {
                $row = $elem.closest('tr');
            }

            $elem[0].scrollIntoView(false);

            var times = 5;
            var highlightFlag = false;
            var interval = $interval(function () {
                times--;
                highlightFlag = !highlightFlag;
                if (times < 0) {
                    $interval.cancel(interval);
                }
                // 闪动并引起用户注意
                if ($row) {
                    //Grid内部，整行闪烁
                    if (highlightFlag) {
                        $row.addClass('flashing');
                    } else {
                        $row.removeClass('flashing');
                    }
                }else {
                    //单个输入框，直接闪烁
                    if (highlightFlag) {
                        $elem.addClass('flashing');
                    } else {
                        $elem.removeClass('flashing');
                    }
                }
            }, 250);
        };
        
        $scope.init();
    }]);