angular.module('common.utils').factory('constants', [function () {
    return {
        APP: {
            NAME: 'ELK Chrome APP', //应用名称
        },


        //网络请求返回状态
        RESULT: {
            SUCCESS: 'success',
            NO_CONTACT: 'noContactInfo',
            FAILURE: 'failure'
        },


        NG_EVENT: {
            GLOBAL: {
                ENTER_KEY_DOWN: 'ENTER_KEY_DOWN',
            }
        },

        CONFIG:{
            ES_SERVER_URL: 'http://192.168.200.5:9200'
        },

        //CodeTable
        CODE_TYPE: {
            PROVIDER: 'PT1001',//配件供应商
            PART_TYPE: 'PT1002',//配件品级
            BRAND: 'PT1003',//配件品牌
            CERTIFICATOR: 'PT1004',//配件认证商
            STOCK_TYPE: 'PT1005',//库存类型
            ORDER_STATUS: 'PT1006', //订单状态
        },

        SYSTEM_MSG: {
            SYSTEM_ERROR: '系统异常，请联系管理员或稍后尝试。'
        },

        MODEL_VALIDATION_TYPE: {
            COMMON: {
                key: 'COMMON',
                text: '',
            },
        },



    }
}]);
