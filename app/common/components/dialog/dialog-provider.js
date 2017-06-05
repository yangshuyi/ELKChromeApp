'use strict';
angular.module('common.components.dialog').provider("dialogProvider", ['$injector', function ($injector) {
        var defaultOptions = {
            title: '',
            isVisible: true,
            hasHead: true,
            autoHide: false,
            collapsible: true,  //Defines if to show collapsible button.
            collapsed: false, //Defines if the panel is collapsed at initialization.
            closable: true,
            closeText: 'close',
            enableDrag: true,
            modal: true,

            dialogCls: '',  //Add a CSS class to the dialog.
            headCls: '',  //Add a CSS class to the panel header.
            bodyCls: '', //Add a CSS class to the panel body.
            bodyStyle: '',

            height: '300px',
            width: '400px'
        };

        var dialogIdGenerator = 0;

        var nextDialogId = function () {
            dialogIdGenerator++;
            return 'dialog_' + dialogIdGenerator;
        };

        return {
            $get: function ($templateRequest, $controller, $rootScope, $compile, $document, $q, $timeout) {
                function getTemplatePromise(templateUrl) {
                    return $templateRequest(templateUrl);
                }

                function getResolvePromises(resolves) {
                    var promisesArr = [];
                    _.each(resolves, function (value) {
                        //因为可能是单独的function，也有可能是需要Angular依赖注入function，所以有function和array两种类型，都需要当成function的方式处理
                        //如果需要传数组，需要将其做成一个obj，然后resolve
                        if (angular.isFunction(value) || angular.isArray(value)) {
                            promisesArr.push($q.when($injector.invoke(value)));
                        }
                        else {
                            promisesArr.push($q.when(value));
                        }
                    });
                    return promisesArr;
                }

                return {
                    //return as promise
                    openDialog: function (params) {
                        var templateUrl = params.templateUrl;
                        var controllerName = params.controllerName;
                        var options = _.assign(angular.copy(defaultOptions), params.options);
                        var resolves = params.resolves;
                        var $dialogScope = null;
                        var deferred = $q.defer();
                        var promise = deferred.promise;

                        $q.all([getTemplatePromise(templateUrl)].concat(getResolvePromises(resolves))).then(function (results) {
                            var tplContent = results[0];
                            var template = angular.element('<dialog api="dialogApi" options="options">' + tplContent + '</dialog>');

                            var $dialogScope = $rootScope.$new();
                            var ctrlLocals = { $scope: $dialogScope};
                            var idx = 1;
                            angular.forEach(resolves, function (value, key) {
                                ctrlLocals[key] = results[idx++];
                            });

                            $controller(controllerName, ctrlLocals);

                            $dialogScope.dialogId = nextDialogId();
                            $dialogScope.options = options;
                            $dialogScope.dialogApi = {};

                            var content = $compile(template)($dialogScope);
                            $('body').append(content);

                            $timeout(function () {
                                deferred.resolve($dialogScope);
                            });
                        });
                        return promise;
                    }
                };
            }
        };
    }]);