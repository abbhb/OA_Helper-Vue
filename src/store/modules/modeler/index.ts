import {defineStore} from 'pinia';
import type {Moddle} from 'moddle';
import type Modeler from 'bpmn-js/lib/Modeler';
import type Modeling from 'bpmn-js/lib/features/modeling/Modeling';
import type Canvas from 'diagram-js/lib/core/Canvas';
import type ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import {buildTreeToList} from '@/components/BpmnJs/bo-utils/variableUtil';
import {toRaw} from 'vue';

export type WidgetOptions = {
    name: string;
    label: string;
    optionItems: [];
};

/**
 * 组件列表
 */
export type WidgetList = {
    id: string;
    key: number;
    icon: string;
    type: string;
    options: WidgetOptions;
};
/**
 * 动态表单数据
 */
export type FormJson = {
    formConfig: any;
    widgetList: WidgetList[];
};
/**
 * 动态表单数据
 */
export type FormJsonList = {
    activityId: string;
    formJson: FormJson;
    isMainFrom: number | 0;
};

/**
 * 节点绑定的数据库字段类型
 */
export type NodelColumn = {
    activityId: string; // 节点id
    // eslint-disable-next-line no-use-before-define
    columns: TableColumns[]; // 表备注
};

/**
 * 数据库信息
 */
export type TableInfo = {
    tableName: string; // 表名称
    type: '' | 'create' | 'ready'; // create: 新表结构,ready:现有的表结构
    tableComment: string; // 表备注
    // eslint-disable-next-line no-use-before-define
    columns: TableColumns[]; // 表备注
};

/**
 * 表结构信息
 */
export type TableColumns = {
    columnName: string; // 行名称
    dataType: string; // 数据类型
    columnComment: string; // 备注
    columnLength: number | -1; // 字段长度
    columnKey: '' | 'PRI'; // 行键
};

/**
 * 组件与表类型对应
 */
export type WidgetDataType = {
    widgetDataType: any; // 组件类型
    widgetDefaultDataType: any; // 组件默认类型
};

export type ModelerStore = {
    processEngine: 'flowable' | 'activiti';
    activeElement: BpmnElement | undefined;
    activeElementId: string | undefined;
    // @ts-ignore
    modeler: Modeler | undefined;
    moddle: Moddle | undefined;
    modeling: any | undefined;
    // @ts-ignore
    canvas: Canvas | undefined;
    // @ts-ignore
    elementRegistry: ElementRegistry | undefined;
    formJsonList: FormJsonList[];
    tableInfo: TableInfo | undefined;
    widgetDataType: WidgetDataType | undefined;
    nodeColumns: NodelColumn[];
};

const defaultState: ModelerStore = {
    processEngine: 'activiti',
    activeElement: undefined,
    activeElementId: undefined,
    modeler: undefined,
    moddle: undefined,
    modeling: undefined,
    canvas: undefined,
    elementRegistry: undefined,
    formJsonList: [],
    tableInfo: undefined,
    widgetDataType: undefined,
    nodeColumns: [],
};

export default defineStore('modeler', {
    state: (): ModelerStore => defaultState,
    getters: {
        getProcessEngine: (state) => toRaw(state.processEngine),
        getActive: (state) => toRaw(state.activeElement),
        getActiveId: (state) => state.activeElementId,
        getModeler: (state) => toRaw(state.modeler),
        getModdle: (state) => toRaw(state.moddle),
        getModeling: (state): Modeling => toRaw(state.modeling),
        getCanvas: (state): Canvas => toRaw(state.canvas),
        getElRegistry: (state) => toRaw(state.elementRegistry),
        getFormJsonList: (state) => toRaw(state.formJsonList),
        getTableInfo: (state) => toRaw(state.tableInfo),
        getWidgetDataType: (state) => toRaw(state.widgetDataType),
        getNodeColumns: (state) => toRaw(state.nodeColumns),
        getNodeColumn: (state) =>
            toRaw(
                // eslint-disable-next-line eqeqeq
                state.nodeColumns.find((t) => t.activityId == state.activeElementId)
                    ?.columns
            ),
    },
    actions: {
        /**
         * 设置流程引擎
         * @param processEngine 流程引擎名称
         */
        setProcessEngine(processEngine: 'activiti' | 'flowable') {
            this.processEngine = processEngine;
        },
        /**
         * 设置设计器对象
         * @param modeler bpmn设计器对象
         */
        setModeler(modeler: Modeler | undefined) {
            this.modeler = modeler;
            if (modeler) {
                // @ts-ignore
                this.modeling = modeler.get<Modeling>('modeling');
                // @ts-ignore
                this.moddle = modeler.get<Moddle>('moddle');
                // @ts-ignore
                this.canvas = modeler.get<Canvas>('canvas');
                // @ts-ignore
                this.elementRegistry = modeler.get<ElementRegistry>('elementRegistry');
            } else {
                this.modeling = undefined;

                this.moddle = undefined;
                this.canvas = undefined;
                this.elementRegistry = undefined;
            }
        },
        /**
         * 设置节点
         * @param element 节点信息
         */
        setElement(element: BpmnElement | undefined) {
            this.activeElement = element;
            this.activeElementId = element.id;
        },
        /**
         * 清空数据
         */
        clearData() {
            this.formJsonList.splice(0, this.formJsonList.length);
            this.nodeColumns.splice(0, this.nodeColumns.length);
            this.widgetDataType = undefined;
            this.tableInfo = undefined;
        },
        /**
         * 添加一个节点的动态表单数据
         * @param formJson 节点的动态表单数据
         */
        setFormJson(formJson: FormJsonList) {
            const index = this.formJsonList.findIndex(
                (t) => t.activityId === formJson.activityId
            );
            if (index !== -1) this.formJsonList.splice(index, 1);
            this.formJsonList.push(formJson);
            if (formJson.formJson.widgetList.length === 0) {
                const index = this.formJsonList.findIndex(
                    (t) => t.activityId === formJson.activityId
                );
                if (index !== -1) this.formJsonList.splice(index, 1);
            }
        },
        /**
         * 设置表结构
         * @param tableInfo 表结构
         */
        setTableInfo(tableInfo: TableInfo | undefined) {
            // 过滤主键
            if (tableInfo)
                tableInfo.columns = tableInfo.columns.filter(
                    (t) => t.columnKey !== 'PRI'
                );
            this.tableInfo = tableInfo;
        },
        /**
         * 设置表字段
         * @param tableColumns 表字段
         */
        setTableColumns(tableColumns: TableColumns[]) {
            if (this.tableInfo) this.tableInfo.columns = tableColumns;
        },
        /**
         * 设置表字段
         * @param tableColumn 表字段
         */
        setTableColumn(tableColumn: TableColumns) {
            if (this.tableInfo) {
                const index = this.tableInfo.columns.findIndex(
                    (t) => t.columnName === tableColumn.columnName
                );
                if (index !== -1) {
                    this.tableInfo.columns.splice(index, 1);
                }
                this.tableInfo.columns.push(tableColumn);
            }
        },
        /**
         * 数据提交时去除无用的数据,如不存在节点的表单数据和绑定字段的数据
         */
        updateData() {
            let i = 0;
            while (i < this.getFormJsonList.length) {
                const formJsonList = this.getFormJsonList[i];
                // eslint-disable-next-line no-underscore-dangle
                const elements = this.elementRegistry._elements;
                if (!elements[formJsonList.activityId]) {
                    this.getFormJsonList.splice(i, 1);
                } else {
                    // eslint-disable-next-line no-plusplus
                    i++;
                }
            }
            i = 0;
            while (i < this.getNodeColumns.length) {
                const nodeColumns = this.getNodeColumns[i];
                // eslint-disable-next-line no-underscore-dangle
                const elements = this.elementRegistry._elements;
                if (!elements[nodeColumns.activityId]) {
                    this.getNodeColumns.splice(i, 1);
                } else {
                    // eslint-disable-next-line no-plusplus
                    i++;
                }
            }
        },
        /**
         * 更新组件表字段,查看字段是否被删除
         */
        // eslint-disable-next-line no-undef
        updateNodeTableColumns(formJson: FormJson) {
            const widgetTree = formJson?.widgetList;
            // 把树形结构转成列表
            const widgetList: any[] = [];
            widgetTree.forEach((widget) => {
                buildTreeToList(widget, widgetList);
            });
            const nodeColumns = this.getNodeColumn;
            if (nodeColumns) {
                let i = 0;
                while (i < nodeColumns.length) {
                    const element = nodeColumns[i];
                    const index = widgetList.findIndex(
                        (t) => t.options.name === element.columnName
                    );
                    if (index === -1) {
                        this.removeNodeColumn(element);
                    } else {
                        // eslint-disable-next-line no-plusplus
                        i++;
                    }
                }
            }
        },
        /**
         * 更新表字段，删除没有绑定的字段
         */
        updateTableColumn() {
            // 如果类型是创建新的数据库 create
            if (this.tableInfo && this.tableInfo.type === 'create') {
                const list: TableColumns[] = [];
                this.nodeColumns.forEach((item) => {
                    item.columns.forEach((item) => list.push(item));
                });
                const {columns} = this.tableInfo;

                let i = 0;
                while (i < columns.length) {
                    const listIndex = list.findIndex(
                        // eslint-disable-next-line no-loop-func
                        (t) => t.columnName === columns[i].columnName
                    );
                    if (listIndex === -1) {
                        columns.splice(i, 1);
                    } else {
                        // eslint-disable-next-line no-plusplus
                        i++;
                    }
                }
            }
        },
        /**
         * 设置组件与数据库类型对应关系
         * @param widgetDataType 组件与数据库类型对应关系
         */
        setWidgetDataType(widgetDataType: WidgetDataType) {
            this.widgetDataType = widgetDataType;
        },
        /**
         * 删除节点绑定的表字段
         * @param tableColumn 表字段信息
         * @returns
         */
        removeNodeColumn(tableColumn: TableColumns) {
            const activityId = this.activeElementId;
            if (!activityId) return;
            const tableItem = this.nodeColumns.find(
                (t) => t.activityId === activityId
            );
            if (!tableItem) return;
            const columnIndex = tableItem.columns.findIndex(
                (t) => t.columnName === tableColumn.columnName
            );
            // eslint-disable-next-line eqeqeq
            if (columnIndex == -1) return;
            tableItem.columns.splice(columnIndex, 1);
            if (tableItem.columns.length === 0) {
                const tableIndex = this.nodeColumns.findIndex(
                    (t) => t.activityId === activityId
                );
                this.nodeColumns.splice(tableIndex, 1);
            }
        },
        /**
         * 设置绑定的表字段
         * @param nodelColumns 表字段信息
         */
        setNodeColumns(nodelColumns: NodelColumn[]) {
            this.nodeColumns = nodelColumns;
        },
        /**
         * 设置节点绑定的表字段
         * @param nodelColumns 表字段信息
         */
        setNodeColumn(tableColumn: TableColumns) {
            const activityId = this.activeElementId;
            if (!activityId) return;
            let tableItem = this.nodeColumns.find((t) => t.activityId === activityId);
            if (!tableItem) {
                tableItem = {
                    activityId,
                    columns: [tableColumn],
                };
                this.nodeColumns.push(tableItem);
            } else {
                this.removeNodeColumn(tableColumn);
                tableItem.columns.push(tableColumn);
            }
        },
    },
});
