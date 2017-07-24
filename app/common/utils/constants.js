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

            environments: [{
                name: 'TEST',
                esServerUrl: 'http://192.168.200.5:9200',
                apps: [
                    {name: 'DRP', ips: ['192.168.200.19']},
                    {name: 'INTERFACE', ips: ['192.168.200.13']},
                    {name: 'PARTS', ips: ['192.168.200.75']}
                ]
            }, {
                name: 'PERFORMANCE',
                esServerUrl: 'http://192.168.200.5:9200',
                apps: [
                    {name: 'DRP', ips: ['192.168.200.23', '192.168.200.32']},
                    {name: 'INTERFACE', ips: []},
                    {name: 'PARTS', ips: []}
                ]
            }, {
                name: 'YJ - PROD',
                esServerUrl: 'http://172.25.2.13:9200',
                apps: [
                    {name: 'DRP', ips: []},
                    {name: 'INTERFACE', ips: []},
                    {name: 'PARTS', ips: ['172.25.2.2']}
                ]
            }, {
                name: 'UAT',
                esServerUrl: 'http://172.25.2.13:9200',
                apps: [
                    {name: 'DRP', ips: ['172.25.2.7']},
                    {name: 'INTERFACE', ips: ['172.25.2.7']},
                    {name: 'PARTS', ips: ['172.25.2.7']}
                ]
            }, {
                name: 'SIT',
                esServerUrl: 'http://172.25.2.13:9200',
                apps: [
                    {name: 'DRP', ips: ['172.25.2.4']},
                    {name: 'INTERFACE', ips: ['172.25.2.4']},
                    {name: 'PARTS', ips: ['172.25.2.4']}
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
