angular.module('model-validation').directive('controlName', ['modelValidation', '$timeout', function (modelValidation, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $(element).on('change', function (e) {
                    if (!modelValidation.isValidationProcessed()) return;

                    $timeout(function(){
                        var controlName = $(element).attr('control-name');
                        var result=modelValidation.validateControl(controlName);
                    });
                });
            }
        }
    }])
