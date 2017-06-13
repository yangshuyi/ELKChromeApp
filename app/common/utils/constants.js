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

        CONFIG: {
            ES_SERVER_URL: 'http://192.168.200.5:9200',

            environments: [{
                name: 'TEST',
                apps: [
                    {name: 'DRP', ips: ['192.168.200.19']},
                    {name: 'INTERFACE', ips: ['192.168.200.13']},
                    {name: 'PARTS', ips: ['192.168.200.75']}
                ]
            }, {
                name: 'PERFORMANCE',
                apps: [
                    {name: 'DRP', ips: ['192.168.200.23', '192.168.200.32']},
                    {name: 'INTERFACE', ips: []},
                    {name: 'PARTS', ips: []}
                ]
            }, {
                name: 'PROD',
                apps: [
                    {name: 'DRP', ips: []},
                    {name: 'INTERFACE', ips: []},
                    {name: 'PARTS', ips: ['172.25.2.2']}
                ]
            }]
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
