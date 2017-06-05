'use strict';
angular.module('common.components.grid').directive('cellCompiler', [
        '$compile',
        function ($compile) {
            return {
                /*require: '^form',*/
                restrict: 'A',
                link: function (scope, element, attrs) {
                    //scope.cellTemplateScope = scope.$eval(attrs.cellTemplateScope);
                    // Watch for changes to expression.
                    scope.$watch(attrs.cellCompiler, function (new_val) {
                        var new_element = angular.element(new_val);
                        element.append(new_element);
                        $compile(new_element)(scope);
                    });
                }
            };
        }
    ]);