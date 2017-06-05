angular.module('model-validation', []);

angular.module('model-validation').factory('modelValidation', ['modelValidationResultService', '$injector', function (modelValidationResultService, $injector) {
    var validationModelMame; //需要验证的目标模型
    var validators = []; //在addValidator中build
    var controlMap = {}; //key:controlName（目前认为controlName是唯一的）, value: validator list; 在addValidator中build，用于快速获取界面控件
    var validateMethodProvider;
    var afterValidationCallback; //validation的回调函数
    var isValidationProcessedFlagMap = {}; //检查某种（nodeName）是否进行过validation {key:node , value: type}

    var VALIDATOR_SEQ = 1;

    var setValidateMethodProvider = function (_validateMethodProvider) {
        validateMethodProvider = _validateMethodProvider;
    };

    var buildControlMap = function () {
        controlMap = {};
        _.each(validators, function (validator) {
            var controlName = validator.controlName;
            if (!controlMap[controlName]) {
                controlMap[controlName] = [];
            }
            controlMap[controlName].push(validator);
        });
    };

    /**
     * 界面打开，需要初始化Validation
     */
    var initValidator = function (_validationModelMame, _validatorConfigs, _afterValidationCallback) {
        isValidationProcessedFlagMap = {};
        validators = [];

        validationModelMame = _validationModelMame;
        addValidators(_validatorConfigs);
        afterValidationCallback = _afterValidationCallback;
    };

    /**
     * 是否已做个validation
     */
    var isValidationProcessed = function () {
        var processed = false;
        _.each(isValidationProcessedFlagMap, function (node, validationType) {
            if (node) {
                processed = true;
            }
        });
        return processed;
    };

    var isNodeValidationProcessed = function (validationNode) {
        var processed = false;
        _.each(isValidationProcessedFlagMap, function (node, validationType) {
            if (validationNode == node) {
                processed = true;
            }
        });

        return processed;
    };

    var addValidators = function (validatorConfigs) {
        var _this = this;
        _.each(validatorConfigs, function (validatorConfig) {
            addValidator.apply(_this, validatorConfig);
        });
        buildControlMap();
    };

    var addValidator = function (tabName, controlName, nodes, errorType, validatorMethodName, validatorMethodParams) {
        var validator = {
            seq: VALIDATOR_SEQ,
            tabName: tabName,           //tab页签的key
            controlName: controlName,   //输入控件的control-name属性,唯一
            nodes: nodes, //验证环节
            errorType: errorType,   //错误类型：error/warning
            validatorMethodName: validatorMethodName,   //执行验证validation的方法名
            validatorMethodParams: validatorMethodParams, //执行验证validation的参数列表
            control: null,   //和UI输入控件进行绑定后的输入控件dom element
            errorMsgArray: [], //错误消息的message
        };

        VALIDATOR_SEQ++;
        validators.push(validator);
    };

    /**
     * 根据controlName清除validator（精确匹配）
     */
    var clearValidatorsByControls = function (tabName, controlNames) {
        var allRemovedValidators = null;
        if (!tabName) {
            allRemovedValidators = validators;
            validators = [];
        } else {
            _.each(controlNames, function (controlName) {
                var removedValidators = _.remove(validators, function (validator) {
                    return validator.tabName == tabName && validator.controlName == controlName;
                })
                allRemovedValidators = _.union(allRemovedValidators, removedValidators);
            });
        }
        _.each(allRemovedValidators, function (validator) {
            modelValidationResultService.remove(validator);
        });

        if (afterValidationCallback) {
            _.each(isValidationProcessedFlagMap, function (value, node) {
                if (value == true) {
                    afterValidationCallback(false, node, modelValidationResultService.getResult());
                }
            });
        }

        buildControlMap();
    };

    /**
     * 将validator和界面控件绑定
     * 界面控件一旦有增删，必须调用该方法
     * @param tabName
     */
    var bindValidatorWithTabControls = function (tabName) {
        var startTime = _.now();
        var controls = [];
        if (tabName) {
            controls = $('[control-name]', 'div[ui-view=' + tabName + ']');
        } else {
            controls = $('[control-name]', 'div[ui-view]');
        }

        _.each(controls, function (control) {
            //根据当前控件的属性，从controlMap中获取当前控件对应的validation
            var $control = $(control);
            var controlName = $control.attr('control-name');
            var validators = controlMap[controlName];
            if (validators) {
                //绑定UI control和validator
                _.each(validators, function (validator) {
                    validator.control = $control;
                    modelValidationResultService.refresh(validator);
                })
            } else {
                //console.log('could not find validatorControl for ' + controlName);
            }
        });
        var endTime = _.now();
        console.log('bindValidatorWithTabControls cost:' + (endTime - startTime) + 'ms');
    };

    /**
     * 执行一条验证内容
     */
    var processValidation = function (validator, currentNode) {
        if (!validationModelMame) {
            return true;
        }
        //
        // if(_.startsWith(validator.controlName, 'unitPrice')){
        //     debugger;
        // }

        //检查validator是否适配当前验证环节
        var inNodeFlag = false;
        if (currentNode) {
            inNodeFlag = _.find(validator.nodes, function (validateNode) {
                return currentNode == validateNode;
            });
        } else {
            inNodeFlag = _.find(validator.nodes, function (validateNode) {
                var processedFlag = false;
                _.each(isValidationProcessedFlagMap, function (node, validationType) {
                    if (node == validateNode) {
                        processedFlag = true;
                    }
                });
                return processedFlag == true;
            });
        }


        if (!inNodeFlag) {
            return true;
        }

        //step1: 获取数据模型
        this[validationModelMame] = $injector.get(validationModelMame);

        //step2:获取对应的验证方法
        var method = validateMethodProvider[validator.validatorMethodName];
        if (method == null) {
            debugger;
            console.log("could not find validator method:" + validator.validatorMethodName);
            return true;
        }

        //step3:解析验证方法参数
        var paramValues = [];
        _.each(validator.validatorMethodParams, function (param) {
            // console.log("param:"+param);
            var paramValue = eval(param);
            // console.log("param:"+param+", paramValue:"+paramValue);
            paramValues.push(paramValue);
        });

        //step4:执行验证
        var msg = validateMethodProvider[validator.validatorMethodName].apply(this, paramValues);

        //step5:处理验证结果
        var valid = false;
        if (msg && msg.length > 0) { //message都是数组格式
            validator.errorMsgArray = msg;
            valid = false;
        } else {
            valid = true;
        }
        return valid;
    };

    var validateControlBySuffix = function (controlNameSuffix, noCallbackFlag) {
        _.each(controlMap, function (value, key) {
            if (_.endsWith(key, controlNameSuffix)) {
                validateControl(key, true);
            }
        });

        if (afterValidationCallback && noCallbackFlag == false) {
            _.each(isValidationProcessedFlagMap, function (node, validationType) {
                if (node) {
                    afterValidationCallback(false, node, modelValidationResultService.getResult());
                }
            });
        }
    };

    /**
     * 基于后端Validation. 标记当前控件出错样式（仅仅样式处理，当前台做过编辑后，样式会立即恢复）
     * 注意：当前controlName必须存在于validate-method-provider中
     */
    var setControlInvalidate = function (controlName, errorType) {
        errorType = errorType||'errors';

        var validators = controlMap[controlName];
        if (validators.length > 0) {
            modelValidationResultService.setControlInvalidate(validators[0].control, errorType);
        }
    };

    /**
     *基于后端Validation. 清除当前控件出错样式（即点击重置按钮后，去除输入框边框样式）
     */
    var setControlValidate = function (controlName, errorType) {
        errorType = errorType||'errors';

        var validators = controlMap[controlName];
        if (validators.length > 0) {
            modelValidationResultService.setControlValidate(validators[0].control, errorType);
        }
    };


    /**
     * 基于UI控件的controlName，对控件进行验证
     * 一般发生在onchange事件后
     */
    var validateControl = function (controlName, noCallbackFlag) {
        //一旦做过任何validation，就要校验界面控件
        var isValidationProcessedFlag = _.find(isValidationProcessedFlagMap, function (validationNode, validationType) {
            if (validationNode) {
                return true;
            } else {
                return false;
            }
        });
        if (!isValidationProcessedFlag) {
            return;
        }

        //step1: 对当前控件进行校验
        var validators = controlMap[controlName];
        if (validators) {
            //执行validator
            _.each(validators, function (validator) {
                var valid = processValidation(validator);
                if (!valid) {
                    _.each(isValidationProcessedFlagMap, function (validationNode, validationType) {
                        if (validationNode) {
                            if (_.includes(validator.nodes, validationNode)) {
                                modelValidationResultService.add(validator, validationType);
                            }
                        }
                    });
                } else {
                    _.each(isValidationProcessedFlagMap, function (validationNode, validationType) {
                        if (validationNode) {
                            if (_.includes(validator.nodes, validationNode)) {
                                modelValidationResultService.remove(validator, validationType);
                            }
                        }
                    });
                }
            })

        } else {
            console.log('could not find validatorControl for ' + controlName);
        }
        //step2:对关联控件进行校验
        var controlElem = $('[control-name=' + controlName + ']');
        var triggerAttr = controlElem.attr('validation-trigger'); //应该是['','']的格式
        if (triggerAttr) {
            //var triggerControlNames = JSON.parse(triggerAttr);
            var triggerControlNames = eval(triggerAttr);
            _.each(triggerControlNames, function (triggerControlName) {
                validateControl(triggerControlName);
            })
        }

        //对于已经做过validation的环节，全部重做。
        //TODO yangsh：如果没有涉及的validationType，可以考虑不做，不过对性能基本没啥影响
        if (afterValidationCallback && noCallbackFlag != true) {
            _.each(isValidationProcessedFlagMap, function (validationNode, validationType) {
                if (validationNode) {
                    afterValidationCallback(false, validationType, validationNode, modelValidationResultService.getResult());
                }
            });
        }
    }

    /**
     * 基于整个数据模型进行验证(仅适配当前环节)
     * 一般发生在对某一validationType做校的时候
     */
    var executeValidation = function (validationType, validationNode, actionNode) {
        if (!validationType) alert('validationType should not be null');
        if (!validationNode) alert('validationNode should not be null');

        //针对保存验证的特殊处理，如果之前点击过提交验证，那么保存操作的时候，也做提交验证。但是actionNode会记成保存
        if (!actionNode) {
            actionNode = validationNode;
        }

        this.resetValidation(validationType);

        //记录该validationType已进行过validation
        isValidationProcessedFlagMap[validationType] = validationNode;

        //遍历所有的validator，执行模型验证
        _.each(validators, function (validator) {
            //step1:执行验证
            var valid = processValidation(validator, validationNode);

            //step2:处理验证结果
            if (!valid) {
                modelValidationResultService.add(validator, validationType);
            }
        });

        if (afterValidationCallback) {
            afterValidationCallback(true, validationType, actionNode, modelValidationResultService.getResult());//full validation, validation results;
        }

        return modelValidationResultService.getResult();
    };

    var resetValidation = function (validationType) {
        isValidationProcessedFlagMap[validationType] = null;
        modelValidationResultService.resetValidationResult(validationType);
    };


    return {
        isValidationProcessed: isValidationProcessed,
        isNodeValidationProcessed: isNodeValidationProcessed,
        initValidator: initValidator,
        clearValidatorsByControls: clearValidatorsByControls,
        addValidators: addValidators,
        bindValidatorWithTabControls: bindValidatorWithTabControls,
        setValidateMethodProvider: setValidateMethodProvider,
        executeValidation: executeValidation,
        resetValidation: resetValidation,
        validateControl: validateControl,
        validateControlBySuffix: validateControlBySuffix,
        setControlInvalidate: setControlInvalidate,
        setControlValidate: setControlValidate
    }
}])


