angular.module('model-validation').factory('modelValidationResultService', ['$timeout', '$interval', '$q', function ($timeout, $interval, $q) {
    var getValidationItemCount = function (validationType, errorType) {
        return getValidators(validationType, errorType).length;
    };

    var getValidationMsgCount = function (validationType, errorType) {
        var count = 0;
        var errorValidators = getValidators(validationType, errorType);
        _.each(errorValidators, function(errorValidator){
            count = count + errorValidator.errorMsgArray.length;
        });

        return count;
    };

    var getValidators = function (validationType, errorType) {
        var validators = _.filter(result.validatorResultMap[validationType], function (validator) {
            if (validator.errorType != errorType) {
                return false;
            }
            return true;
        });
        return validators;
    };


    var getResult = function () {
        _.each(result.validatorResultMap, function(validators, type){
            result.validatorResultMap[type]=_.sortBy(validators, ['seq', 'validatorMethodName']);
        });

        return result;
    };

    var refresh = function(validator){
        //validator没有绑定界面控件
        if (!validator || !validator.control) {
            return;
        }

        var included = false;
        _.each(result.validatorResultMap, function(validators){
           if( _.include(validators, validator)){
               included = true;
           }
        });

        if (included) {
            //UI处理
            if (validator.errorType == 'errors') {
                $(validator.control).addClass('data-error');
            }
            if (validator.errorType == 'warnings') {
                $(validator.control).addClass('data-warning');
            }
        }
    };

    var add = function (validator, validationType) {
        if (!validator) {
            return;
        }

        var foundValidator = _.find(result.validatorResultMap[validationType], function(item){
            return item.tabName == validator.tabName && item.controlName == validator.controlName &&item.errorType == validator.errorType &&item.validatorMethodName == validator.validatorMethodName && item.seq == validator.seq;
        });
        if(!foundValidator){
            if(!result.validatorResultMap[validationType]){
                result.validatorResultMap[validationType] = [];
            }
            result.validatorResultMap[validationType].push(validator);
        }

        //UI处理
        if (validator.control) {
            setControlInvalidate($(validator.control), validator.errorType);
        }
    };

    var setControlInvalidate = function(control, errorType){
        if (errorType == 'errors') {
            $(control).addClass('data-error');
        }
        if (errorType == 'warnings') {
            $(control).addClass('data-warning');
        }
    };

    /**
     *  清除指定环节的所有错误结果
     */
    var resetValidationResult = function(validationType){
        var removeList = result.validatorResultMap[validationType];
        result.validatorResultMap[validationType] = [];

        //必须用中间变量，否则下标会错乱
        _.each(removeList, function(validator){
            remove(validator, validationType);
        });
    };

    var remove = function (validator, validationType) {
        if (!validator) {
            return;
        }

        if(validationType!=null){
            _.remove(result.validatorResultMap[validationType], function (item) {
                return item.tabName == validator.tabName && item.controlName == validator.controlName && item.errorType == validator.errorType && item.validatorMethodName == validator.validatorMethodName && item.seq == validator.seq;
            });
        }else{
            _.each(result.validatorResultMap, function(validators){
                _.remove(validators, function (item) {
                    return item.tabName == validator.tabName && item.controlName == validator.controlName && item.errorType == validator.errorType && item.validatorMethodName == validator.validatorMethodName && item.seq == validator.seq;
                });
            });
        }

        //UI处理
        if (validator.control) {
            var foundControlHasOtherError = false;

            _.each(result.validatorResultMap, function(validators){
                var found = _.find(validators, function (item) {
                    return item.tabName == validator.tabName && item.controlName == validator.controlName && item.errorType == validator.errorType;
                });
                if(found){
                    foundControlHasOtherError = true;
                }
            });

            //如果存在其他错误情况，则不能移除错误样式
            if (foundControlHasOtherError) {
                return;
            }

            //UI处理
            if (validator.control) {
                setControlValidate($(validator.control), validator.errorType);
            }
        }
    };
    //对于后端验证，一出错误样式（即，去除输入框边框样式）
    var setControlValidate = function(control, errorType) {
        if (errorType == 'errors') {
            $(control).removeClass('data-error');
        }
        if (errorType == 'warnings') {
            $(control).removeClass('data-warning');
        }
    };


    //全局的model validation result
    var result = {
        validatorResultMap: {}, //验证失败的validator, {validationType: []}
        getValidationItemCount: getValidationItemCount, //根据错误类型，返回验证失败的数量
        getValidationMsgCount: getValidationMsgCount,//根据错误类型，返回验证失败的消息数量
        getValidators: getValidators,//根据错误类型，返回验证失败的验证器
    };

    return {
        getResult: getResult,
        resetValidationResult: resetValidationResult,
        add: add,
        remove: remove,
        refresh: refresh,
        setControlInvalidate:setControlInvalidate,
        setControlValidate: setControlValidate
    };
}])



