angular.module('common.businessComponents.model').factory('queryModel', [function () {
    var columns = [];

    var definedColumnsMap =
        {
            "@timestamp": {
                columnName: "@timestamp",
                queryName: '@timestamp',

                displayName: {
                    default: '時間戳',
                },
                defaultSetting: {
                    $checked: true,
                    displayOrder: 0,
                    displayWidth: 100,
                },
            },
            "ENV": {
                columnName: "ENV",
                queryName: 'ENV.raw',
                displayName: {
                    default: '環境',
                },
                defaultSetting: {
                    $checked: true,
                    displayOrder: 0,
                    displayWidth: 100,
                },
            },
            "APP": {
                columnName: "APP",
                queryName: 'APP.raw',
                displayName: {
                    default: '應用',
                }, defaultSetting: {
                    $checked: true,
                    displayOrder: 0,
                    displayWidth: 100,
                },

            },
            "COMMON_REQ_CLIENT_IP": {
                columnName: "COMMON_REQ_CLIENT_IP",
                queryName: 'COMMON_REQ_CLIENT_IP.raw',
                displayName: {
                    default: '用戶IP',
                    batchJob: 'BatchJob',
                }, defaultSetting: {
                    $checked: true,
                    displayOrder: 0,
                    displayWidth: 100,
                },

            },
            "host": {
                columnName: "host",
                queryName: 'host.raw',
                displayName: {
                    default: '應用服務器IP',
                },
                defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 100,
                },

            },
            "priority": {
                columnName: "priority",
                queryName: 'priority.raw',
                displayName: {
                    default: '日志級別',
                },
                defaultSetting: {
                    $checked: true,
                    displayOrder: 0,
                    displayWidth: 100,
                },

            },
            "COMMON_COUNT": {
                columnName: "COMMON_COUNT",
                queryName: 'COMMON_COUNT.raw',
                displayName: {
                    default: '數量統計',
                },
                defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 100,
                },

            },
            "COMMON_REQ_TIMING": {
                columnName: "COMMON_REQ_TIMING",
                queryName: 'COMMON_REQ_TIMING.raw',
                displayName: {
                    default: '用戶請求縂耗時',
                },
                defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 100,
                },
            },

            "COMMON_REQ_URL": {
                columnName: "COMMON_REQ_URL",
                queryName: 'COMMON_REQ_URL.raw',
                displayName: {
                    default: '用戶請求URL',
                },
                defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 100,
                },
            },
            "COMMON_REQ_USER_ID": {
                columnName: "COMMON_REQ_USER_ID",
                queryName: 'COMMON_REQ_USER_ID.raw',
                displayName: {
                    default: '用戶ID',
                },
                defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 100,
                },
            },
            "COMMON_TIMING": {
                columnName: "COMMON_TIMING",
                queryName: 'COMMON_TIMING.raw',
                displayName: {
                    default: '時間統計',
                },
                defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 100,
                },
            },
            "MSG": {
                columnName: "MSG",
                queryName: 'MSG.raw',
                defaultChecked: true,
                displayName: {
                    default: '日志',
                },
                defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 100,
                },
            },
            "stack_trace": {
                columnName: "stack_trace",
                queryName: 'stack_trace',
                displayName: {
                    default: 'StackTrace',
                },
                defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 100,
                },
            },
            "BATCH_JOB_TASK_ID": {
                columnName: "BATCH_JOB_TASK_ID",
                queryName: '@timestamp',
                displayName: {
                    default: 'BatchJob Task ID',
                },
                defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 100,
                },
            },
            "BATCH_JOB_BUSINESS_ID": {
                columnName: "BATCH_JOB_BUSINESS_ID",
                queryName: 'BATCH_JOB_BUSINESS_ID.raw',
                displayName: {
                    default: 'BatchJob Busniess ID',
                },
                defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 100,
                },
            },
            "BATCH_JOB_CLIENT_SERVICE_BEAN_NAME": {
                columnName: "BATCH_JOB_CLIENT_SERVICE_BEAN_NAME",
                queryName: 'BATCH_JOB_CLIENT_SERVICE_BEAN_NAME.raw',
                displayName: {
                    default: 'BatchJob Service',
                },
                defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 100,
                },
            },
//AUDIT_JOB_TASK_ID
        "AUDIT_CLAIM_ID": {
            columnName: "AUDIT_CLAIM_ID",
            queryName: 'AUDIT_CLAIM_ID.raw',
            type: null,
            displayName: {
                default: '定損單ID',
            },
            defaultSetting: {
                $checked: false,
                displayOrder: 0,
                displayWidth: 100,
            },
        },
        "AUDIT_NODE_TYPE": {
            columnName: "AUDIT_NODE_TYPE",
            queryName: 'AUDIT_NODE_TYPE.raw',
            type: null,
            displayName: {
                default: '規則環節',
            },
            defaultSetting: {
                $checked: false,
                displayOrder: 0,
                displayWidth: 100,
            },
        },
        "AUDIT_REPORT_TYPE": {
            columnName: "AUDIT_REPORT_TYPE",
            queryName: 'AUDIT_REPORT_TYPE.raw',
            type: null,
            displayName: {
                default: '報告類型',
            },
            defaultSetting: {
                $checked: false,
                displayOrder: 0,
                displayWidth: 100,
            },
        },


        "AUDIT_CCC_COMPANY_CODE": {
            columnName: "AUDIT_CCC_COMPANY_CODE",
            queryName: 'AUDIT_CCC_COMPANY_CODE.raw',
            type: null,
            displayName: {
                default: '執行的公司Code',
            },
            defaultSetting: {
                $checked: false,
                displayOrder: 0,
                displayWidth: 100,
            },
        },
        "PIT_PROCESS_FILE_NAME": {
            columnName: "PIT_PROCESS_FILE_NAME",
            queryName: 'PIT_PROCESS_FILE_NAME.raw',
            type: null,
            displayName: {
                default: 'PIT數據處理文件名',
            },
            defaultSetting: {
                $checked: false,
                displayOrder: 0,
                displayWidth: 100,
            },
        },
        "PIT_PROCESS_FILE_TYPE": {
            columnName: "PIT_PROCESS_FILE_TYPE",
            queryName: 'PIT_PROCESS_FILE_TYPE.raw',
            type: null,
            displayName: {
                default: 'PIT數據處理文件類型',
            },
            defaultSetting: {
                $checked: false,
                displayOrder: 0,
                displayWidth: 100,
            },
        },
    };


    var setIndexColumns = function (_columns) {
        // columns = _.uniqBy(_columns, _.isEqual);
        columns = _.uniqBy(_columns, 'columnName');

        _.each(columns, function (column) {
            initialColumn(column);
        });
        return columns;
    };

    var getIndexColumns = function () {
        return columns;
    };

    var initialColumn = function (column) {
        var definedColumn = definedColumnsMap[column.columnName];
        if (definedColumn) {
            _.assignIn(column, definedColumn);
        } else {
            column.displayName = {default: column.columnName};
        }
    };

    return {
        setIndexColumns: setIndexColumns,
        getIndexColumns: getIndexColumns,

    };
}]);
