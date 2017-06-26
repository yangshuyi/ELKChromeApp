angular.module('common.businessComponents.model').factory('queryModel', [function () {
    var columns = [];

    var definedColumnsMap =
        {
            "@timestamp": {
                columnName: "@timestamp",
                queryName: '@timestamp',

                caption: {
                    default: '时间戳(中国)',
                },
                defaultSetting: {
                    $checked: true,
                    displayOrder: 0,
                    displayWidth: 160,
                },
            },
            "ENV": {
                columnName: "ENV",
                queryName: 'ENV.raw',
                caption: {
                    default: '环境',
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
                caption: {
                    default: '应用',
                }, defaultSetting: {
                    $checked: true,
                    displayOrder: 0,
                    displayWidth: 70,
                },

            },
            "COMMON_REQ_CLIENT_IP": {
                columnName: "COMMON_REQ_CLIENT_IP",
                queryName: 'COMMON_REQ_CLIENT_IP.raw',
                caption: {
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
                caption: {
                    default: '应用服务器IP',
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
                caption: {
                    default: '日志級別',
                },
                defaultSetting: {
                    $checked: true,
                    displayOrder: 0,
                    displayWidth: 60,
                },

            },
            "COMMON_COUNT": {
                columnName: "COMMON_COUNT",
                queryName: 'COMMON_COUNT.raw',
                caption: {
                    default: '数量统计',
                },
                defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 60,
                },

            },
            "COMMON_REQ_TIMING": {
                columnName: "COMMON_REQ_TIMING",
                queryName: 'COMMON_REQ_TIMING.raw',
                caption: {
                    default: '请求耗时',
                },
                defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 60,
                },
            },

            "COMMON_REQ_URL": {
                columnName: "COMMON_REQ_URL",
                queryName: 'COMMON_REQ_URL.raw',
                caption: {
                    default: '用戶请求URL',
                },
                defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 400,
                },
            },
            "COMMON_REQ_USER_ID": {
                columnName: "COMMON_REQ_USER_ID",
                queryName: 'COMMON_REQ_USER_ID.raw',
                caption: {
                    default: '用戶ID',
                },
                defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 50,
                },
            },
            "COMMON_TIMING": {
                columnName: "COMMON_TIMING",
                queryName: 'COMMON_TIMING.raw',
                caption: {
                    default: '时间统计',
                },
                defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 60,
                },
            },
            "MSG": {
                columnName: "MSG",
                queryName: 'MSG.raw',
                defaultChecked: true,
                caption: {
                    default: '日志',
                },
                defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 500,
                },
            },
            "stack_trace": {
                columnName: "stack_trace",
                queryName: 'stack_trace',
                caption: {
                    default: 'StackTrace',
                },
                defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 300,
                },
            },
            "BATCH_JOB_TASK_ID": {
                columnName: "BATCH_JOB_TASK_ID",
                queryName: '@timestamp',
                caption: {
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
                caption: {
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
                caption: {
                    default: 'BatchJob Service',
                },
                defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 100,
                },
            },
            "AUDIT_CLAIM_ID": {
                columnName: "AUDIT_CLAIM_ID",
                queryName: 'AUDIT_CLAIM_ID.raw',
                type: null,
                caption: {
                    default: '定损单ID',
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
                caption: {
                    default: '规则环节',
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
                caption: {
                    default: '报告类型',
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
                caption: {
                    default: '执行的公司Code',
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
                caption: {
                    default: 'PIT数据处理文件名',
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
                caption: {
                    default: 'PIT数据处理文件類型',
                },
                defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 100,
                },
            },

            "INTERFACE_CODE": {
                columnName: "INTERFACE_CODE",
                queryName: 'INTERFACE_CODE.raw',
                caption: {
                    default: '接口Code',
                }, defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 150,
                },
            },
            "REPAIR_ORDER_NO": {
                columnName: "REPAIR_ORDER_NO",
                queryName: 'REPAIR_ORDER_NO.raw',
                caption: {
                    default: '接口-工单号',
                }, defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 150,
                },
            },
            "META_DATA_PROCESS_ID": {
                columnName: "META_DATA_PROCESS_ID",
                queryName: 'META_DATA_PROCESS_ID.raw',
                caption: {
                    default: '基础数据发布-Process Id',
                }, defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 150,
                },
            },
            "META_DATA_VEHICLE_SERIES_ID": {
                columnName: "META_DATA_VEHICLE_SERIES_ID",
                queryName: 'META_DATA_VEHICLE_SERIES_ID.raw',
                caption: {
                    default: '基础数据发布-车系ID',
                }, defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 150,
                },
            },
            "META_DATA_JSON_FILE_TYPE": {
                columnName: "META_DATA_JSON_FILE_TYPE",
                queryName: 'META_DATA_JSON_FILE_TYPE.raw',
                caption: {
                    default: '基础数据发布-文件类型',
                }, defaultSetting: {
                    $checked: false,
                    displayOrder: 0,
                    displayWidth: 150,
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
            column.displayName = column.caption.default;
        } else {
            column.displayName = column.columnName;
            column.defaultSetting = {
                $checked: false,
                displayOrder: 0,
                displayWidth: 100,
            };
        }
    };


    var getQueryTerm = function (content, columnName) {
        var result = [];

        var column = definedColumnsMap[columnName];
        if (column == null) {
            return returnObj;
        }
        var queryName = column.queryName;

        _.each(content.filter.and, function (element) {
            if (element['term'] != null && element['term'][queryName] != null) {
                result.push(element['term'][queryName]);
            }
        });

        return result;
    };

    var getQueryPrefix = function (content, columnName) {
        var positiveAppArray = [];
        var nagtiveAppArray = [];
        var returnObj = {'positive': positiveAppArray, 'nagtive': nagtiveAppArray};

        var column = definedColumnsMap[columnName];
        if (column == null) {
            return returnObj;
        }
        var queryName = column.queryName;

        _.each(content.filter.and, function (element) {
            if (element['prefix'] != null && element['prefix'][queryName] != null) {
                positiveAppArray.push(element['prefix'][queryName]);
            }
        });

        return returnObj;
    };


    return {
        setIndexColumns: setIndexColumns,
        getIndexColumns: getIndexColumns,
        getQueryTerm: getQueryTerm,
        getQueryPrefix: getQueryPrefix,

    };
}]);
