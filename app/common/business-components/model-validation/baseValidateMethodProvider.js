angular.module('model-validation').factory('baseValidateMethodProvider', function () {
    var require = function (model, name, flag) {
        if (flag == false) {
            return [];
        }
        if (model == null || model === "") {
            return [name + '不能为空。'];
        }
        return [];
    };

    var minLength = function (model, min, name) {
        if (typeof model !== 'string') return null;
        if (model.length >= min) return null;
        return [that.getName(name) + '至少' + min + '个字符'];
    };

    var maxLength = function (model, max, name) {
        if (typeof model !== 'string') return null;
        if (model.length <= max) return null;
        return [that.getName(name) + '最长' + max + '个字符'];
    };

    return {
        require: require,
        minLength: minLength,
        maxLength: maxLength,
    }
})

