import {skuReg} from "./common";

var strategies = {
    isNoEmpty: function (value, errorMsg) {
        if (value === '') return errorMsg;
    },
    isNoSpace: function (value, errorMsg) {
        if (value.trim() === '') return errorMsg;
    },
    minLength: function (value, length, errorMsg) {
        if (value.trim().length < length) return errorMsg;
    },
    maxLength: function (value, length, errorMsg) {
        if (value.length > length) return errorMsg;
    },
    length: function (value, length, errorMsg) {
        if (value.length !== length) return errorMsg;
    },
    isMobile: function (value, errorMsg) {
        if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(value)) return errorMsg;
    },
    isTrue: function (value, errorMsg) {
        if (!value) return errorMsg;
    },
    isInt: function (value, errorMsg) {
        let reg = new RegExp('^[1-9]\\d*$');
        if (!reg.test(value)) return errorMsg;
    },
    isSku: function (value, errorMsg) {
        if (!skuReg(value)) return errorMsg;
    },
    isEmptyArray: function (value, errorMsg) {
        if (!value.length) {
            return errorMsg;
        }
    },
    greaterThan0:function (value, errorMsg) {
        if(value <= 0){
            return errorMsg;
        }
    }
};

class Validator {
    constructor() {
        this.cache = [];
    }

    add(value, rules) {
        for (let i = 0, rule; rule = rules[i++];) {
            let strategyAry = rule.strategy.split(':');
            let errorMsg = rule.errorMsg;
            this.cache.push(function () {
                let strategy = strategyAry.shift();
                strategyAry.unshift(value);
                strategyAry.push(errorMsg);
                return strategies[strategy].apply(value, strategyAry);
            })
        }
    }

    start() {
        for (let i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
            let errorMsg = validatorFunc();
            if (errorMsg) {
                return errorMsg;
            }
        }
    }
}

export default Validator;