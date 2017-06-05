'use strict';
angular.module('common.utils').factory('decimalUtils', [function () {
    return {
        plus: function (valA, valB, valC, valD, valE) {
            var a = new Decimal(Number(valA || 0));
            var b = new Decimal(Number(valB || 0));
            var c = new Decimal(Number(valC || 0));
            var d = new Decimal(Number(valD || 0));
            var e = new Decimal(Number(valE || 0));
            return a.plus(b).plus(c).plus(d).plus(e).toNumber();
        },
        plusWithP2: function (valA, valB, valC, valD, valE) {
            var value = this.plus(valA, valB, valC, valD, valE);
            return Number(value).toFixed(2);
        },
        minus: function (valA, valB, fractionalDigits) {
            var a = new Decimal(Number(valA || 0));
            var b = new Decimal(Number(valB || 0));

            var value = a.minus(b).toNumber();
            if(fractionalDigits == null){
                return value;
            }else{
                return value.toFixed(fractionalDigits);
            }
        },

        multiply: function (valA, valB, valC, valD, valE) {
            var value = null;
            var a = new Decimal(Number(valA || 0));
            var b = new Decimal(Number(valB || 0));
            value = a.mul(b);

            if(valC == null){
                return value.toNumber();
            }

            var c = new Decimal(Number(valC || 0));
            value = value.mul(c);
            if(valD == null){
                return value.toNumber();
            }

            var d = new Decimal(Number(valD || 0));
            value = value.mul(d);
            if(valE == null){
                return value.toNumber();
            }
            var e = new Decimal(Number(valE || 0));
            value = value.mul(e);

            return value.toNumber();
        },

        multiplyWithP2: function (valA, valB, valC, valD, valE) {
            var value = this.multiply(valA, valB, valC, valD, valE);
            return Number(value).toFixed(2);
        },

        multiplyWithP1: function (valA, valB, valC, valD, valE) {
            var value = this.multiply(valA, valB, valC, valD, valE);
            return Number(value).toFixed(1);
        },

        dividing: function (a, b, fractionalDigits) {
            if (!a) {
                a = 0;
            } else {
                a = parseFloat(a + "");
            }

            if (!b) {
                b = 0;
                //被除数为零，基于drp业务，返回零
                if(fractionalDigits == null){
                    return Number(0)
                }else{
                    return Number(0).toFixed(fractionalDigits);
                }

            } else {
                b = parseFloat(b + "");
            }

            if(fractionalDigits == null){
                return parseFloat(Number(a / b));
            }else{
                return parseFloat((Number(a / b)).toFixed(fractionalDigits));
            }
        },

        dividingWithP2: function (a, b) {
            return this.dividing(a,b,2);
        },

        dividingWithP1: function (a, b) {
            return this.dividing(a,b,1);
        }
    };
}]);